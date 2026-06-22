import type { Request, Response } from "express";
import type { CriarPedidoUseCase } from "../../application/pedido/CriarPedidoUseCase.js";
import type { AdicionarItemAoPedidoUseCase } from "../../application/pedido/AdicionarItemAoPedidoUseCase.js";
import type { GetPedidoByIdUseCase, GetPedidosByUsuarioUseCase } from "../../application/pedido/GetPedidoUseCase.js";
import type { CancelarPedidoUseCase } from "../../application/pedido/CancelarPedidoUseCase.js";
import type { DeletePedidoUseCase } from "../../application/pedido/DeletePedidoUseCase.js";
import { EstoqueInsuficienteError } from "../../domain/products/estoque.js";

export class PedidoController {
  constructor(
    private criarPedidoUseCase: CriarPedidoUseCase,
    private adicionarItemUseCase: AdicionarItemAoPedidoUseCase,
    private getPedidoByIdUseCase: GetPedidoByIdUseCase,
    private getPedidosByUsuarioUseCase: GetPedidosByUsuarioUseCase,
    private cancelarPedidoUseCase: CancelarPedidoUseCase,
    private deletePedidoUseCase: DeletePedidoUseCase
  ) {}

  async criarPedido(req: Request, res: Response): Promise<void> {
    try {
      const { idUsuario, itens } = req.body as {
        idUsuario?: number;
        itens?: Array<{ idProduto?: number | null; idCombo?: number | null; quantidade: number; precoUnitario?: number }>;
      };

      if (!idUsuario || !itens || itens.length === 0) {
        res.status(400).json({ error: "Missing required fields." });
        return;
      }

      const pedido = await this.criarPedidoUseCase.execute({
        idUsuario: Number(idUsuario),
        itens: itens.map((i) => ({
          idProduto: i.idProduto ?? null,
          idCombo: i.idCombo ?? null,
          quantidade: i.quantidade,
          precoUnitario: i.precoUnitario ?? 0,
        })),
      });

      res.status(201).json(pedido);
    } catch (error) {
      if (error instanceof EstoqueInsuficienteError) {
        res.status(422).json({ error: error.message });
        return;
      }
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async adicionarItem(req: Request, res: Response): Promise<void> {
    try {
      const idPedido = Number(req.params.id);
      if (isNaN(idPedido)) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }

      const { idProduto, idCombo, quantidade, precoUnitario } = req.body as {
        idProduto?: number | null;
        idCombo?: number | null;
        quantidade: number;
        precoUnitario?: number;
      };

      const item = await this.adicionarItemUseCase.execute(idPedido, {
        idProduto: idProduto ?? null,
        idCombo: idCombo ?? null,
        quantidade,
        precoUnitario: precoUnitario ?? 0,
      });

      res.status(201).json(item);
    } catch (error) {
      if (error instanceof EstoqueInsuficienteError) {
        res.status(422).json({ error: error.message });
        return;
      }
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async getPedidoById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }
      const pedido = await this.getPedidoByIdUseCase.execute(id);
      if (!pedido) {
        res.status(404).json({ error: "Pedido not found." });
        return;
      }
      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async getPedidosByUsuario(req: Request, res: Response): Promise<void> {
    try {
      const idUsuario = Number(req.params.idUsuario);
      if (isNaN(idUsuario)) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }
      const pedidos = await this.getPedidosByUsuarioUseCase.execute(idUsuario);
      res.status(200).json(pedidos);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async cancelarPedido(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }

      const pedido = await this.cancelarPedidoUseCase.execute(id);
      res.status(200).json(pedido);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async deletePedido(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }

      await this.deletePedidoUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
}
