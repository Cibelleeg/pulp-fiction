import { GetCinemaUseCase, GetCinemaByIdUseCase } from "../application/cinema/GetCinemaUseCase.js";
import type { Request, Response } from "express";


export class CinemaController {
    constructor(
        private useCase: GetCinemaUseCase, 
        private useCaseById: GetCinemaByIdUseCase
    ) { }

    async getAllCinemas(req: Request, res: Response): Promise<void> {

        try {
            const cinemas = await this.useCase.execute();
            res.status(200).json(cinemas);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
        
    }


    
    async getCinemaById(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }

    const cinema = await this.useCaseById.executeById(id);

    if (!cinema) {
      res.status(404).json({ error: "Cinema não encontrado." });
      return;
    }

    res.status(200).json(cinema);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
}
}



