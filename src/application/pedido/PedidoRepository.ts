import type { Pedido, ItemPedido } from "../../domain/pedido/Pedido.js";

export type CreateItemPedidoInput = {
  idProduto?: number | null;
  idCombo?: number | null;
  quantidade: number;
  precoUnitario: number;
};

export type CreatePedidoInput = {
  idUsuario: number;
  itens: CreateItemPedidoInput[];
};

export interface PedidoRepository {
  findById(id: number): Promise<Pedido | null>;
  findByUsuario(idUsuario: number): Promise<Pedido[]>;
  create(data: { idUsuario: number; total: number; status: string; dataPedido: Date }): Promise<Pedido>;
  addItem(idPedido: number, item: CreateItemPedidoInput & { subtotal: number }): Promise<ItemPedido>;
  updateTotal(idPedido: number, total: number): Promise<void>;
  updateStatus(idPedido: number, status: string): Promise<Pedido>;
  delete(idPedido: number): Promise<void>;
}
