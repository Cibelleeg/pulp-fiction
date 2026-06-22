import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";

import type { Pedido, ItemPedido } from "../../domain/pedido/Pedido.js";
import type { PedidoRepository } from "../../application/pedido/PedidoRepository.js";

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: config.databaseUrl });
  return new PrismaClient({ adapter });
}

function mapItemPedido(raw: any): ItemPedido {
  return {
    idItemPedido: raw.idItemPedido,
    idPedido: raw.idPedido,
    idProduto: raw.idProduto ?? null,
    idCombo: raw.idCombo ?? null,
    quantidade: raw.quantidade,
    precoUnitario: raw.precoUnitario,
    subtotal: raw.subtotal,
  };
}

function mapPedido(raw: any): Pedido {
  return {
    id: raw.idPedido,
    idUsuario: raw.idUsuario,
    total: raw.total,
    status: raw.status,
    dataPedido: raw.dataPedido,
    itens: raw.itemPedido?.map(mapItemPedido),
  };
}

export class PrismaPedidoRepository implements PedidoRepository {
  constructor(private prisma: PrismaClient = createPrismaClient()) {}

  async findById(id: number): Promise<Pedido | null> {
    const pedido = await this.prisma.pedido.findUnique({
      where: { idPedido: id },
      include: { itemPedido: true },
    });
    if (!pedido) return null;
    return mapPedido(pedido);
  }

  async findByUsuario(idUsuario: number): Promise<Pedido[]> {
    const pedidos = await this.prisma.pedido.findMany({
      where: { idUsuario },
      include: { itemPedido: true },
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
    item: { idProduto?: number | null; idCombo?: number | null; quantidade: number; precoUnitario: number; subtotal: number }
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

  async updateStatus(idPedido: number, status: string): Promise<Pedido> {
    const updated = await this.prisma.pedido.update({
      where: { idPedido },
      data: { status },
      include: { itemPedido: true },
    });
    return mapPedido(updated);
  }

  async delete(idPedido: number): Promise<void> {
    await this.prisma.itemPedido.deleteMany({ where: { idPedido } });
    await this.prisma.pedido.delete({ where: { idPedido } });
  }
}
