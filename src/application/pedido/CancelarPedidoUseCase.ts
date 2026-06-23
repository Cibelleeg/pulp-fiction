import type { PedidoRepository } from "./PedidoRepository.js";
import type { Pedido } from "../../domain/pedido/Pedido.js";

export class CancelarPedidoUseCase {
  constructor(private pedidoRepository: PedidoRepository) {}

  async execute(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new Error("Pedido not found.");
    }

    if (pedido.status === "CANCELADO") {
      throw new Error("The order has already been cancelled.");
    }

    return this.pedidoRepository.cancelWithRestock(id);
  }
}
