import type { Ingresso, StatusIngresso } from "../../domain/ingresso/Ingresso.js";
import type { TypeIngresso } from "../../domain/ticketType/TicketType.js";

export type CreateIngressoInput = {
  idSessao: number;
  idUsuario: number;
  idAssento: number;
  idPedido: number;
  tipo: TypeIngresso;
  preco: number;
  status: StatusIngresso;
  dataEmissao: Date;
};

export interface IngressoRepository {
  findById(id: number): Promise<Ingresso | null>;
  findBySessaoAndAssento(idSessao: number, idAssento: number): Promise<Ingresso | null>;
  countMeiasBySessao(idSessao: number): Promise<number>;
  create(data: CreateIngressoInput): Promise<Ingresso>;
}
