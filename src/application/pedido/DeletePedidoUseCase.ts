import type { PedidoRepository } from "./PedidoRepository.js";

export class DeletePedidoUseCase {
  constructor(private pedidoRepository: PedidoRepository) {}

  async execute(id: number): Promise<void> {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new Error("Pedido not found.");
    }

    await this.pedidoRepository.delete(id);
  }
}
