import type { Pedido, ItemPedido } from "../../domain/pedido/Pedido.js";
import type { StatusIngresso } from "../../domain/ingresso/Ingresso.js";
import type { TypeIngresso } from "../../domain/ticketType/TicketType.js";

export type CreateItemPedidoInput = {
  idProduto: number | null;
  idCombo: number | null;
  quantidade: number;
  precoUnitario: number;
};

export type CreatePedidoInput = {
  idUsuario: number;
  itens: CreateItemPedidoInput[];
};

export type StockUpdate = {
  idProduto: number;
  nomeProduto: string;
  quantidade: number;
};

export type CreatePedidoIngressoInput = {
  idSessao: number;
  idUsuario: number;
  idAssento: number;
  tipo: TypeIngresso;
  preco: number;
  status: StatusIngresso;
  dataEmissao: Date;
};

export interface PedidoRepository {
  findById(id: number): Promise<Pedido | null>;
  findByUsuario(idUsuario: number): Promise<Pedido[]>;
  create(data: { idUsuario: number; total: number; status: string; dataPedido: Date }): Promise<Pedido>;
  addItem(idPedido: number, item: CreateItemPedidoInput & { subtotal: number }): Promise<ItemPedido>;
  updateTotal(idPedido: number, total: number): Promise<void>;
  createWithItemsAndStockUpdate(
    data: { idUsuario: number; total: number; status: string; dataPedido: Date },
    items: Array<CreateItemPedidoInput & { subtotal: number }>,
    stockUpdates: StockUpdate[]
  ): Promise<Pedido>;
  createWithItemsStockAndTicket(
    data: { idUsuario: number; total: number; status: string; dataPedido: Date },
    items: Array<CreateItemPedidoInput & { subtotal: number }>,
    stockUpdates: StockUpdate[],
    ingressos: CreatePedidoIngressoInput[]
  ): Promise<Pedido>;
  addItemWithStockUpdate(
    idPedido: number,
    item: CreateItemPedidoInput & { subtotal: number },
    stockUpdates: StockUpdate[],
    totalIncrement: number
  ): Promise<ItemPedido>;
  updateStatus(idPedido: number, status: string): Promise<Pedido>;
  cancelWithRestock(idPedido: number): Promise<Pedido>;
  delete(idPedido: number): Promise<void>;
}
