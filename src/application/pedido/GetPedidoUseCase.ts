import type { PedidoRepository } from "./PedidoRepository.js";
import type { Pedido } from "../../domain/pedido/Pedido.js";

export class GetPedidoByIdUseCase {
  constructor(private pedidoRepository: PedidoRepository) {}

  async execute(id: number): Promise<Pedido | null> {
    return this.pedidoRepository.findById(id);
  }
}

export class GetPedidosByUsuarioUseCase {
  constructor(private pedidoRepository: PedidoRepository) {}

  async execute(idUsuario: number): Promise<Pedido[]> {
    return this.pedidoRepository.findByUsuario(idUsuario);
  }
}
