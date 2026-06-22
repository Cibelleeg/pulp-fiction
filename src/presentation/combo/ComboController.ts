import type { Request, Response } from "express";
import type { CreateComboUseCase } from "../../application/combo/CreateComboUseCase.js";
import type { GetCombosUseCase } from "../../application/combo/GetComboUseCase.js";
import type { GetComboByIdUseCase } from "../../application/combo/GetComboByIdUseCase.js";
import type { DeleteComboUseCase } from "../../application/combo/DeleteComboUseCase.js";
import type { UpdateComboUseCase } from "../../application/combo/UpdateComboUseCase.js";

export class ComboController {
  constructor(
    private getCombosUseCase: GetCombosUseCase,
    private getComboByIdUseCase: GetComboByIdUseCase,
    private createComboUseCase: CreateComboUseCase,
    private deleteComboUseCase: DeleteComboUseCase,
    private updateComboUseCase: UpdateComboUseCase
  ) {}

  async getCombos(req: Request, res: Response): Promise<void> {
    try {
      const combos = await this.getCombosUseCase.execute();
      res.status(200).json(combos);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async getComboById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }
      const combo = await this.getComboByIdUseCase.execute(id);
      if (!combo) {
        res.status(404).json({ error: "Combo not found." });
        return;
      }
      res.status(200).json(combo);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async createCombo(req: Request, res: Response): Promise<void> {
    try {
      const { nome, descricao, preco, ativo, itens } = req.body as {
        nome?: string;
        descricao?: string;
        preco?: number;
        ativo?: boolean;
        itens?: Array<{ idProduto: number; quantidade: number }>;
      };

      if (!nome || !descricao || preco === undefined || !itens || itens.length === 0) {
        res.status(400).json({ error: "Missing required fields." });
        return;
      }

      const combo = await this.createComboUseCase.execute({
        nome,
        descricao,
        preco: Number(preco),
        ativo: ativo ?? true,
        itens,
      });
      res.status(201).json(combo);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async updateCombo(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }

      const { nome, descricao, preco, ativo } = req.body as {
        nome?: string;
        descricao?: string;
        preco?: number;
        ativo?: boolean;
      };

      const combo = await this.updateComboUseCase.execute(id, {
        nome,
        descricao,
        preco: preco !== undefined ? Number(preco) : undefined,
        ativo,
      });

      res.status(200).json(combo);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async deleteCombo(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }
      await this.deleteComboUseCase.execute(id);
      res.status(204).json({ message: "Combo deleted successfully." });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
}
