import type { Sala } from "../../domain/sala/Sala.js";

export type CreateSalaInput = {
  idCinema: number;
  nome: string;
  capacidade: number;
  tipo: string;
};

export type UpdateSalaInput = Partial<Omit<CreateSalaInput, "idCinema">>;

export interface SalaRepository {
  findAll(): Promise<Sala[]>;
  findById(id: number): Promise<Sala | null>;
  findByCinema(idCinema: number): Promise<Sala[]>;
  create(data: CreateSalaInput): Promise<Sala>;
  updateById(id: number, data: UpdateSalaInput): Promise<Sala>;
  deleteById(id: number): Promise<void>;
}
