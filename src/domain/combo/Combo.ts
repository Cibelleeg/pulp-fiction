export interface ItemCombo {
  idItemCombo: number;
  idCombo: number;
  idProduto: number;
  quantidade: number;
}

export interface Combo {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  ativo: boolean;
  itens?: ItemCombo[];
}
