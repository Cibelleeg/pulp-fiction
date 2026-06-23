import type { Assento } from "../../domain/assento/Assento.js";

export type CreateAssentoInput = {
  idSala: number;
  numero: string;
  fila: string;
  tipo: string;
};

export type UpdateAssentoInput = Partial<Omit<CreateAssentoInput, "idSala">>;

export interface AssentoRepository {
  findAll(): Promise<Assento[]>;
  findById(id: number): Promise<Assento | null>;
  findBySala(idSala: number): Promise<Assento[]>;
  create(data: CreateAssentoInput): Promise<Assento>;
  updateById(id: number, data: UpdateAssentoInput): Promise<Assento>;
  deleteById(id: number): Promise<void>;
}
