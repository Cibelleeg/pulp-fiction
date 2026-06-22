import type { Combo, ItemCombo } from "../../domain/combo/Combo.js";

export type CreateComboInput = {
  nome: string;
  descricao: string;
  preco: number;
  ativo?: boolean;
  itens: Array<{ idProduto: number; quantidade: number }>;
};

export type UpdateComboInput = {
  nome?: string;
  descricao?: string;
  preco?: number;
  ativo?: boolean;
};

export interface ComboRepository {
  findAll(): Promise<Combo[]>;
  findById(id: number): Promise<Combo | null>;
  create(data: CreateComboInput): Promise<Combo>;
  deleteById(id: number): Promise<void>;
  updateById(id: number, data: UpdateComboInput): Promise<Combo>;
}
