import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";
import { EstoqueInsuficienteError } from "../../domain/products/estoque.js";

import type { Pedido, ItemPedido, IngressoPedido } from "../../domain/pedido/Pedido.js";
import type { PedidoRepository, StockUpdate } from "../../application/pedido/PedidoRepository.js";

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: config.databaseUrl });
  return new PrismaClient({ adapter });
}

function mapItemPedido(raw: any): ItemPedido {
  return {
    idItemPedido: raw.idItemPedido,
    idPedido: raw.idPedido,
    idProduto: raw.idProduto ?? null,
    produtoNome: raw.produto?.nome ?? null,
    idCombo: raw.idCombo ?? null,
    comboNome: raw.combo?.nome ?? null,
    quantidade: raw.quantidade,
    precoUnitario: raw.precoUnitario,
    subtotal: raw.subtotal,
  };
}

function mapIngressoPedido(raw: any): IngressoPedido {
  return {
    idIngresso: raw.idIngresso,
    idSessao: raw.idSessao,
    idAssento: raw.idAssento,
    tipo: raw.tipo,
    preco: raw.preco,
    status: raw.status,
    dataEmissao: raw.dataEmissao,
    filmeTitulo: raw.sessao?.filme?.titulo ?? null,
    cinemaNome: raw.sessao?.sala?.cinema?.nome ?? null,
    salaNome: raw.sessao?.sala?.nome ?? null,
    assento: raw.assento ? `${raw.assento.fila}${raw.assento.numero}` : null,
    dataHora: raw.sessao?.dataHora ?? null,
    idioma: raw.sessao?.idioma ?? null,
    formato: raw.sessao?.formato ?? null,
  };
}

const pedidoInclude = {
  itemPedido: {
    include: {
      produto: { select: { nome: true } },
      combo: { select: { nome: true } },
    },
  },
  ingressos: {
    include: {
      assento: true,
      sessao: {
        include: {
          filme: { select: { titulo: true } },
          sala: {
            include: {
              cinema: { select: { nome: true } },
            },
          },
        },
      },
    },
  },
};

function mapPedido(raw: any): Pedido {
  return {
    id: raw.idPedido,
    idUsuario: raw.idUsuario,
    total: raw.total,
    status: raw.status,
    dataPedido: raw.dataPedido,
    itens: raw.itemPedido?.map(mapItemPedido),
    ingressos: raw.ingressos?.map(mapIngressoPedido),
  };
}

export class PrismaPedidoRepository implements PedidoRepository {
  constructor(private prisma: PrismaClient = createPrismaClient()) {}

  private async decrementStock(tx: any, stockUpdates: StockUpdate[]): Promise<void> {
    for (const update of stockUpdates) {
      const result = await tx.produto.updateMany({
        where: {
          idProduto: update.idProduto,
          estoque: { gte: update.quantidade },
        },
        data: {
          estoque: { decrement: update.quantidade },
        },
      });

      if (result.count !== 1) {
        throw new EstoqueInsuficienteError(update.nomeProduto, 0, update.quantidade);
      }
    }
  }

  async findById(id: number): Promise<Pedido | null> {
    const pedido = await this.prisma.pedido.findUnique({
      where: { idPedido: id },
      include: pedidoInclude,
    });
    if (!pedido) return null;
    return mapPedido(pedido);
  }

  async findByUsuario(idUsuario: number): Promise<Pedido[]> {
    const pedidos = await this.prisma.pedido.findMany({
      where: { idUsuario },
      include: pedidoInclude,
      orderBy: { dataPedido: "desc" },
    });
    return pedidos.map(mapPedido);
  }

  async create(data: { idUsuario: number; total: number; status: string; dataPedido: Date }): Promise<Pedido> {
    const pedido = await this.prisma.pedido.create({
      data: {
        idUsuario: data.idUsuario,
        total: data.total,
        status: data.status,
        dataPedido: data.dataPedido,
      },
    });
    return mapPedido(pedido);
  }

  async addItem(
    idPedido: number,
    item: { idProduto: number | null; idCombo: number | null; quantidade: number; precoUnitario: number; subtotal: number }
  ): Promise<ItemPedido> {
    const created = await this.prisma.itemPedido.create({
      data: {
        idPedido,
        idProduto: item.idProduto ?? null,
        idCombo: item.idCombo ?? null,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        subtotal: item.subtotal,
      },
    });
    return mapItemPedido(created);
  }

  async updateTotal(idPedido: number, total: number): Promise<void> {
    await this.prisma.pedido.update({ where: { idPedido }, data: { total } });
  }

  async createWithItemsAndStockUpdate(
    data: { idUsuario: number; total: number; status: string; dataPedido: Date },
    items: Array<{ idProduto: number | null; idCombo: number | null; quantidade: number; precoUnitario: number; subtotal: number }>,
    stockUpdates: StockUpdate[]
  ): Promise<Pedido> {
    return await this.prisma.$transaction(async (tx) => {
      await this.decrementStock(tx, stockUpdates);

      const pedido = await tx.pedido.create({
        data: {
          idUsuario: data.idUsuario,
          total: data.total,
          status: data.status,
          dataPedido: data.dataPedido,
        },
      });

      const createdItems = [];
      for (const item of items) {
        createdItems.push(await tx.itemPedido.create({
          data: {
            idPedido: pedido.idPedido,
            idProduto: item.idProduto,
            idCombo: item.idCombo,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            subtotal: item.subtotal,
          },
        }));
      }

      return mapPedido({ ...pedido, itemPedido: createdItems });
    });
  }

  async createWithItemsStockAndTicket(
    data: { idUsuario: number; total: number; status: string; dataPedido: Date },
    items: Array<{ idProduto: number | null; idCombo: number | null; quantidade: number; precoUnitario: number; subtotal: number }>,
    stockUpdates: StockUpdate[],
    ingressos: Array<{
      idSessao: number;
      idUsuario: number;
      idAssento: number;
      tipo: string;
      preco: number;
      status: string;
      dataEmissao: Date;
    }>
  ): Promise<Pedido> {
    return await this.prisma.$transaction(async (tx) => {
      await this.decrementStock(tx, stockUpdates);

      const pedido = await tx.pedido.create({
        data: {
          idUsuario: data.idUsuario,
          total: data.total,
          status: data.status,
          dataPedido: data.dataPedido,
        },
      });

      for (const item of items) {
        await tx.itemPedido.create({
          data: {
            idPedido: pedido.idPedido,
            idProduto: item.idProduto,
            idCombo: item.idCombo,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            subtotal: item.subtotal,
          },
        });
      }

      for (const ingresso of ingressos) {
        await tx.ingresso.create({
          data: {
            idPedido: pedido.idPedido,
            idSessao: ingresso.idSessao,
            idUsuario: ingresso.idUsuario,
            idAssento: ingresso.idAssento,
            tipo: ingresso.tipo,
            preco: ingresso.preco,
            status: ingresso.status,
            dataEmissao: ingresso.dataEmissao,
          },
        });
      }

      const completed = await tx.pedido.findUnique({
        where: { idPedido: pedido.idPedido },
        include: pedidoInclude,
      });
      return mapPedido(completed);
    });
  }

  async addItemWithStockUpdate(
    idPedido: number,
    item: { idProduto: number | null; idCombo: number | null; quantidade: number; precoUnitario: number; subtotal: number },
    stockUpdates: StockUpdate[],
    totalIncrement: number
  ): Promise<ItemPedido> {
    return await this.prisma.$transaction(async (tx) => {
      await this.decrementStock(tx, stockUpdates);

      const created = await tx.itemPedido.create({
        data: {
          idPedido,
          idProduto: item.idProduto,
          idCombo: item.idCombo,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal,
        },
      });

      await tx.pedido.update({
        where: { idPedido },
        data: { total: { increment: totalIncrement } },
      });

      return mapItemPedido(created);
    });
  }

  async updateStatus(idPedido: number, status: string): Promise<Pedido> {
    const updated = await this.prisma.pedido.update({
      where: { idPedido },
      data: { status },
      include: pedidoInclude,
    });
    return mapPedido(updated);
  }

  async cancelWithRestock(idPedido: number): Promise<Pedido> {
    return await this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.findUnique({
        where: { idPedido },
        include: {
          itemPedido: true,
          ingressos: true,
        },
      });

      if (!pedido) throw new Error("Pedido not found.");
      if (pedido.status === "CANCELADO") throw new Error("The order has already been cancelled.");

      const produtoRestock = new Map<number, number>();
      for (const item of pedido.itemPedido ?? []) {
        if (item.idProduto != null) {
          produtoRestock.set(item.idProduto, (produtoRestock.get(item.idProduto) ?? 0) + item.quantidade);
        }

        if (item.idCombo != null) {
          const itensCombo = await tx.itemCombo.findMany({ where: { idCombo: item.idCombo } });
          for (const itemCombo of itensCombo) {
            const quantidade = itemCombo.quantidade * item.quantidade;
            produtoRestock.set(itemCombo.idProduto, (produtoRestock.get(itemCombo.idProduto) ?? 0) + quantidade);
          }
        }
      }

      for (const [idProduto, quantidade] of produtoRestock) {
        await tx.produto.update({
          where: { idProduto },
          data: { estoque: { increment: quantidade } },
        });
      }

      await tx.ingresso.updateMany({
        where: {
          idPedido,
          status: { not: "CANCELADO" },
        },
        data: { status: "CANCELADO" },
      });

      const updated = await tx.pedido.update({
        where: { idPedido },
        data: { status: "CANCELADO" },
        include: pedidoInclude,
      });

      return mapPedido(updated);
    });
  }

  async delete(idPedido: number): Promise<void> {
    await this.prisma.itemPedido.deleteMany({ where: { idPedido } });
    await this.prisma.pedido.delete({ where: { idPedido } });
  }
}
