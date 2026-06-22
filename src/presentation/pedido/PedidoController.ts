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

      if (!Number.isInteger(Number(idUsuario)) || Number(idUsuario) <= 0) {
        res.status(400).json({ error: "Invalid user ID." });
        return;
      }

      if (req.user?.role !== "ADMIN" && Number(idUsuario) !== req.user?.id) {
        res.status(403).json({ error: "Forbidden." });
        return;
      }

      if (itens.some((i) => !Number.isInteger(Number(i.quantidade)) || Number(i.quantidade) <= 0)) {
        res.status(400).json({ error: "Invalid item quantity." });
        return;
      }

      const pedido = await this.criarPedidoUseCase.execute({
        idUsuario: Number(idUsuario),
        itens: itens.map((i) => ({
          idProduto: i.idProduto != null ? Number(i.idProduto) : null,
          idCombo: i.idCombo != null ? Number(i.idCombo) : null,
          quantidade: Number(i.quantidade),
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

      if (!Number.isInteger(Number(quantidade)) || Number(quantidade) <= 0) {
        res.status(400).json({ error: "Invalid item quantity." });
        return;
      }

      const pedido = await this.getPedidoByIdUseCase.execute(idPedido);
      if (!pedido) {
        res.status(404).json({ error: "Pedido not found." });
        return;
      }
      if (req.user?.role !== "ADMIN" && pedido.idUsuario !== req.user?.id) {
        res.status(403).json({ error: "Forbidden." });
        return;
      }

      const item = await this.adicionarItemUseCase.execute(idPedido, {
        idProduto: idProduto != null ? Number(idProduto) : null,
        idCombo: idCombo != null ? Number(idCombo) : null,
        quantidade: Number(quantidade),
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
      if (req.user?.role !== "ADMIN" && pedido.idUsuario !== req.user?.id) {
        res.status(403).json({ error: "Forbidden." });
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
      if (req.user?.role !== "ADMIN" && idUsuario !== req.user?.id) {
        res.status(403).json({ error: "Forbidden." });
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

      const existingPedido = await this.getPedidoByIdUseCase.execute(id);
      if (!existingPedido) {
        res.status(404).json({ error: "Pedido not found." });
        return;
      }
      if (req.user?.role !== "ADMIN" && existingPedido.idUsuario !== req.user?.id) {
        res.status(403).json({ error: "Forbidden." });
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
