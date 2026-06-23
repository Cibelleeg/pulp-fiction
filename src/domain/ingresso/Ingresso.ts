import { TypeIngresso } from "../ticketType/TicketType.js";

export type StatusIngresso = "ATIVO" | "CANCELADO" | "USADO";

export interface Ingresso {
  idIngresso: number;
  idSessao: number;
  idUsuario: number;
  idAssento: number;
  idPedido: number;
  tipo: TypeIngresso;
  preco: number;
  status: StatusIngresso;
  dataEmissao: Date;
}
