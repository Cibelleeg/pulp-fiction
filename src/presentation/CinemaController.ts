import type { CreateCinemaUseCase } from "../application/cinema/CreateCinemaUseCase.js";
import { GetCinemaUseCase } from "../application/cinema/GetCinemaUseCase.js";
import type { Request, Response } from "express";


export class CinemaController {
    constructor(
        private getAllCinemasUseCase: GetCinemaUseCase,
        private createCinemaUseCase: CreateCinemaUseCase
    ) { }

    async getAllCinemas(req: Request, res: Response): Promise<void> {

        try {
            const cinemas = await this.getAllCinemasUseCase.execute();
            res.status(200).json(cinemas);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
        
    }

    async createCinema(req: Request, res: Response): Promise<void> {

        try {
            const cinemaData = req.body;
            const createdCinema = await this.createCinemaUseCase.execute(cinemaData);
            res.status(201).json(createdCinema);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
    }
}
