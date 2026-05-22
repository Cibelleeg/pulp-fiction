import { GetCinemaUseCase } from "../application/cinema/GetCinemaUseCase.js";
import type { Request, Response } from "express";


export class CinemaController {
    constructor(private useCase: GetCinemaUseCase) { }

    async getAllCinemas(req: Request, res: Response): Promise<void> {

        try {
            const cinemas = await this.useCase.execute();
            res.status(200).json(cinemas);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
        
    }
}


