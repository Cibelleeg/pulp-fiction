import type { Sessao } from "../../domain/session/Session.js";

export type CreateSessionInput = {
  movieId: number;
  roomId: number;
  dateTime: Date;
  language: string;
  format: string;
  basePrice: number;
};

export type UpdateSessionInput = Partial<CreateSessionInput>;

export interface SessionRepository {
  findAll(): Promise<Sessao[]>;

  findById(id: number): Promise<Sessao | null>;

  create(data: CreateSessionInput): Promise<Sessao>;

  updateById(id: number, data: UpdateSessionInput): Promise<Sessao>;

  deleteById(id: number): Promise<void>;
}
