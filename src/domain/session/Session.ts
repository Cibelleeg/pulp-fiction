import { TypeIngresso } from "../ticketType/TicketType.js";
import { DomainError } from "../error/DomainError.js";

export class Sessao {
  constructor(
    public id: number,
    public movieId: number,
    public roomId: number,
    public dateTime: Date,
    public totalSeats: number,
    public availableSeats: number,
    public basePrice: number
  ) {}

     estaAberta(agora?: Date): boolean {
    const referencia = agora ?? new Date();
    return referencia < this.dateTime;
  }

  temAssentoDisponivel(): boolean {
    return this.availableSeats > 0;
  }

  podeVenderMeia(): boolean {
    const meiaVendidas = this.totalSeats - this.availableSeats;
    const limite = Math.floor(this.totalSeats * 0.4);
    return meiaVendidas < limite;
  }

  calcularPreco(tipo: TypeIngresso): number {
    if (tipo === TypeIngresso.MEIA) {
      if (!this.podeVenderMeia()) {
        throw new DomainError("Limite de meia-entrada atingido para esta sessão.");
      }
      return Math.floor(this.basePrice / 2);
    }
    return this.basePrice;
  }

}