export interface ItemPedido {
  idItemPedido: number;
  idPedido: number;
  idProduto?: number | null;
  produtoNome?: string | null;
  idCombo?: number | null;
  comboNome?: string | null;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface IngressoPedido {
  idIngresso: number;
  idSessao: number;
  idAssento: number;
  tipo: string;
  preco: number;
  status: string;
  dataEmissao: Date;
  filmeTitulo?: string | null;
  cinemaNome?: string | null;
  salaNome?: string | null;
  assento?: string | null;
  dataHora?: Date | null;
  idioma?: string | null;
  formato?: string | null;
}

export interface Pedido {
  id: number;
  idUsuario: number;
  total: number;
  status: string;
  dataPedido: Date;
  itens?: ItemPedido[];
  ingressos?: IngressoPedido[];
}

export function calcularSubtotal(precoUnitario: number, quantidade: number): number {
  return precoUnitario * quantidade;
}

export function calcularTotal(itens: Pick<ItemPedido, "subtotal">[]): number {
  return itens.reduce((acc, item) => acc + item.subtotal, 0);
}
