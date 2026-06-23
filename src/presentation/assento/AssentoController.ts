import type { Request, Response } from "express";
import type { CreateAssentoUseCase } from "../../application/assento/CreateAssentoUseCase.js";
import type { GetAssentoByIdUseCase, GetAssentosBySalaUseCase, GetAssentosUseCase } from "../../application/assento/GetAssentosUseCase.js";
import type { UpdateAssentoUseCase } from "../../application/assento/UpdateAssentoUseCase.js";
import type { DeleteAssentoUseCase } from "../../application/assento/DeleteAssentoUseCase.js";

export class AssentoController {
  constructor(
    private createAssentoUseCase: CreateAssentoUseCase,
    private getAssentosUseCase: GetAssentosUseCase,
    private getAssentoByIdUseCase: GetAssentoByIdUseCase,
    private getAssentosBySalaUseCase: GetAssentosBySalaUseCase,
    private updateAssentoUseCase: UpdateAssentoUseCase,
    private deleteAssentoUseCase: DeleteAssentoUseCase
  ) {}

  async createAssento(req: Request, res: Response): Promise<void> {
    try {
      const { idSala, numero, fila, tipo } = req.body;

      if (!idSala || !numero || !fila || !tipo) {
        res.status(400).json({ error: "Campos obrigatórios: idSala, numero, fila, tipo." });
        return;
      }

      const assento = await this.createAssentoUseCase.execute({
        idSala: Number(idSala),
        numero: String(numero),
        fila: String(fila),
        tipo,
      });

      res.status(201).json(assento);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAssentos(_req: Request, res: Response): Promise<void> {
    try {
      const assentos = await this.getAssentosUseCase.execute();
      res.status(200).json(assentos);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async getAssentoById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido." });
        return;
      }

      const assento = await this.getAssentoByIdUseCase.execute(id);
      if (!assento) {
        res.status(404).json({ error: "Assento não encontrado." });
        return;
      }

      res.status(200).json(assento);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async getAssentosBySala(req: Request, res: Response): Promise<void> {
    try {
      const idSala = Number(req.params.idSala);
      if (isNaN(idSala)) {
        res.status(400).json({ error: "ID da sala inválido." });
        return;
      }

      const assentos = await this.getAssentosBySalaUseCase.execute(idSala);
      res.status(200).json(assentos);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async updateAssento(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido." });
        return;
      }

      const { numero, fila, tipo } = req.body;
      const data: { numero?: string; fila?: string; tipo?: string } = {};

      if (numero !== undefined) data.numero = String(numero);
      if (fila !== undefined) data.fila = String(fila);
      if (tipo !== undefined) data.tipo = tipo;

      const assento = await this.updateAssentoUseCase.execute(id, data);
      res.status(200).json(assento);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async deleteAssento(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido." });
        return;
      }

      await this.deleteAssentoUseCase.execute(id);
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
