export interface ItemPedido {
  idItemPedido: number;
  idPedido: number;
  idProduto?: number | null;
  idCombo?: number | null;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  idUsuario: number;
  total: number;
  status: string;
  dataPedido: Date;
  itens?: ItemPedido[];
}

export function calcularSubtotal(precoUnitario: number, quantidade: number): number {
  return precoUnitario * quantidade;
}

export function calcularTotal(itens: Pick<ItemPedido, "subtotal">[]): number {
  return itens.reduce((acc, item) => acc + item.subtotal, 0);
}
