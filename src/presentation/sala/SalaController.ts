import type { Request, Response } from "express";
import type { CreateSalaUseCase } from "../../application/sala/CreateSalaUseCase.js";
import type { GetSalaByIdUseCase, GetSalasByCinemaUseCase, GetSalasUseCase } from "../../application/sala/GetSalasUseCase.js";
import type { UpdateSalaUseCase } from "../../application/sala/UpdateSalaUseCase.js";
import type { DeleteSalaUseCase } from "../../application/sala/DeleteSalaUseCase.js";

export class SalaController {
  constructor(
    private createSalaUseCase: CreateSalaUseCase,
    private getSalasUseCase: GetSalasUseCase,
    private getSalaByIdUseCase: GetSalaByIdUseCase,
    private getSalasByCinemaUseCase: GetSalasByCinemaUseCase,
    private updateSalaUseCase: UpdateSalaUseCase,
    private deleteSalaUseCase: DeleteSalaUseCase
  ) {}

  async createSala(req: Request, res: Response): Promise<void> {
    try {
      const { idCinema, nome, capacidade, tipo } = req.body;

      if (!idCinema || !nome || !capacidade || !tipo) {
        res.status(400).json({ error: "Campos obrigatórios: idCinema, nome, capacidade, tipo." });
        return;
      }

      const sala = await this.createSalaUseCase.execute({
        idCinema: Number(idCinema),
        nome,
        capacidade: Number(capacidade),
        tipo,
      });

      res.status(201).json(sala);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getSalas(_req: Request, res: Response): Promise<void> {
    try {
      const salas = await this.getSalasUseCase.execute();
      res.status(200).json(salas);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async getSalaById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido." });
        return;
      }

      const sala = await this.getSalaByIdUseCase.execute(id);
      if (!sala) {
        res.status(404).json({ error: "Sala não encontrada." });
        return;
      }

      res.status(200).json(sala);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async getSalasByCinema(req: Request, res: Response): Promise<void> {
    try {
      const idCinema = Number(req.params.idCinema);
      if (isNaN(idCinema)) {
        res.status(400).json({ error: "ID do cinema inválido." });
        return;
      }

      const salas = await this.getSalasByCinemaUseCase.execute(idCinema);
      res.status(200).json(salas);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async updateSala(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido." });
        return;
      }

      const { nome, capacidade, tipo } = req.body;
      const data: { nome?: string; capacidade?: number; tipo?: string } = {};

      if (nome !== undefined) data.nome = nome;
      if (capacidade !== undefined) data.capacidade = Number(capacidade);
      if (tipo !== undefined) data.tipo = tipo;

      const sala = await this.updateSalaUseCase.execute(id, data);
      res.status(200).json(sala);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async deleteSala(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido." });
        return;
      }

      await this.deleteSalaUseCase.execute(id);
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
