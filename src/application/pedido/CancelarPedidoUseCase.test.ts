import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CancelarPedidoUseCase } from "./CancelarPedidoUseCase.js";
import type { Pedido } from "../../domain/pedido/Pedido.js";
import type { PedidoRepository } from "./PedidoRepository.js";

class PedidoRepositoryFake implements PedidoRepository {
  cancelCalled = false;

  constructor(private pedido: Pedido | null) {}

  async findById(): Promise<Pedido | null> {
    return this.pedido;
  }

  async cancelWithRestock(): Promise<Pedido> {
    this.cancelCalled = true;
    return { ...this.pedido!, status: "CANCELADO" };
  }

  async findByUsuario(): Promise<Pedido[]> { return []; }
  async create(): Promise<Pedido> { throw new Error("not implemented"); }
  async addItem(): Promise<never> { throw new Error("not implemented"); }
  async updateTotal(): Promise<void> {}
  async createWithItemsAndStockUpdate(): Promise<Pedido> { throw new Error("not implemented"); }
  async createWithItemsStockAndTicket(): Promise<Pedido> { throw new Error("not implemented"); }
  async addItemWithStockUpdate(): Promise<never> { throw new Error("not implemented"); }
  async updateStatus(): Promise<Pedido> { throw new Error("not implemented"); }
  async delete(): Promise<void> {}
}

const pedidoAberto: Pedido = {
  id: 1,
  idUsuario: 1,
  total: 50,
  status: "ABERTO",
  dataPedido: new Date(),
};

describe("CancelarPedidoUseCase", () => {
  it("usa cancelamento completo do repositorio", async () => {
    const repository = new PedidoRepositoryFake(pedidoAberto);
    const pedido = await new CancelarPedidoUseCase(repository).execute(1);

    assert.equal(repository.cancelCalled, true);
    assert.equal(pedido.status, "CANCELADO");
  });

  it("bloqueia pedido ja cancelado", async () => {
    const repository = new PedidoRepositoryFake({ ...pedidoAberto, status: "CANCELADO" });

    await assert.rejects(
      () => new CancelarPedidoUseCase(repository).execute(1),
      /already been cancelled/
    );
    assert.equal(repository.cancelCalled, false);
  });
});
