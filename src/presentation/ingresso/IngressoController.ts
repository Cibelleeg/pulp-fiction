import type { Request, Response } from "express";
import type { ComprarIngressoUseCase } from "../../application/ingresso/ComprarIngressoUseCase.js";
import { DomainError } from "../../domain/error/DomainError.js";
import { TypeIngresso } from "../../domain/ticketType/TicketType.js";

export class IngressoController {
  constructor(private comprarIngressoUseCase: ComprarIngressoUseCase) {}

  async comprarIngresso(req: Request, res: Response): Promise<void> {
    try {
      const idSessao = Number(req.params.id);
      if (isNaN(idSessao)) {
        res.status(400).json({ error: "ID de sessão inválido." });
        return;
      }

      const { idAssento, idPedido, tipo } = req.body;

      if (!idAssento || !idPedido || !tipo) {
        res.status(400).json({ error: "Campos obrigatórios: idAssento, idPedido, tipo." });
        return;
      }

      if (!Object.values(TypeIngresso).includes(tipo)) {
        res.status(400).json({ error: `Tipo de ingresso inválido. Use: ${Object.values(TypeIngresso).join(", ")}.` });
        return;
      }

      const idUsuario = req.user!.id;

      const ingresso = await this.comprarIngressoUseCase.execute({
        idSessao,
        idUsuario,
        idAssento: Number(idAssento),
        idPedido: Number(idPedido),
        tipo: tipo as TypeIngresso,
      });

      res.status(201).json(ingresso);
    } catch (error) {
      if (error instanceof DomainError) {
        res.status(422).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
}
