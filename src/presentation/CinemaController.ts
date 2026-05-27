import { GetCinemaUseCase, GetCinemaByIdUseCase} from "../application/cinema/GetCinemaUseCase.js";
import { DeleteCinemaByIdUseCase } from "../application/cinema/DeleteCinemaUseCase.js";
import { UpdateCinemaByIdUseCase } from "../application/cinema/UpdateCinemaUseCase.js";
import type { CreateCinemaUseCase } from "../application/cinema/CreateCinemaUseCase.js";
import type { Request, Response } from "express";


export class CinemaController {
    constructor(
        private getAllCinemasUseCase: GetCinemaUseCase,
        private useCaseById: GetCinemaByIdUseCase,
        private createCinemaUseCase: CreateCinemaUseCase,
        private deleteCinemaByIdUseCase: DeleteCinemaByIdUseCase,
        private updateCinemaByIdUseCase: UpdateCinemaByIdUseCase
    ) { }

    async getAllCinemas(req: Request, res: Response): Promise<void> {

        try {
            const cinemas = await this.getAllCinemasUseCase.execute();
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

    async createCinema(req: Request, res: Response): Promise<void> {

        try {
            const cinemaData = req.body;
            const createdCinema = await this.createCinemaUseCase.execute(cinemaData);
            res.status(201).json(createdCinema);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
    }
    async deleteCinemaById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: "ID inválido." });
                return;
            }
            await this.deleteCinemaByIdUseCase.executeDeleteById(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error && error.message === "Cinema not found.") {
                res.status(404).json({ error: "Cinema not found." });
                return;
            }
            res.status(500).json({ error: "Internal Server Error." });
        }
    }
    async updateCinemaById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: "ID inválido." });
                return;
            }
            const cinemaData = req.body;
            const updatedCinema = await this.updateCinemaByIdUseCase.executeUpdateById(id, cinemaData);
            res.status(200).json(updatedCinema);
        } catch (error) {
            if (error instanceof Error && error.message === "Cinema not found.") {
                res.status(404).json({ error: "Cinema not found." });
                return;
            }
            res.status(500).json({ error: "Internal Server Error." });
        }
    }
}