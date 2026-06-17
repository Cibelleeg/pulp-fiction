import type { CreateMovieUseCase } from "../../application/movie/CreateMovieUseCase.js";
import type { GetMoviesUseCase } from "../../application/movie/GetMoviesUseCase.js";
import type { GetMovieByIdUseCase } from "../../application/movie/GetMovieByIdUseCase.js";
import type { UpdateMovieUseCase } from "../../application/movie/UpdateMovieUseCase.js";
import type { DeleteMovieUseCase } from "../../application/movie/DeleteMovieUseCase.js";
import type { Request, Response } from "express";

export class MovieController {
    constructor(
        private createMovieUseCase: CreateMovieUseCase,
        private getMoviesUseCase: GetMoviesUseCase,
        private getMovieByIdUseCase: GetMovieByIdUseCase,
        private updateMovieUseCase: UpdateMovieUseCase,
        private deleteMovieUseCase: DeleteMovieUseCase
    ) { }

    async createMovie(req: Request, res: Response): Promise<void> {

        try {
            const data = req.body;
            const { title, synopsis, duration, ageRating, genre, releaseDate } = req.body;

            if (!title || !synopsis || !duration || !ageRating || !genre || !releaseDate) {
                res.status(400).json({ error: "Campos obrigatórios faltando." });
                return;
            }
            const createdMovie = await this.createMovieUseCase.execute(data);
            res.status(201).json(createdMovie);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getMovies(req: Request, res: Response): Promise<void> {
        try {
            const movies = await this.getMoviesUseCase.execute();
            res.status(200).json(movies);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
    }

    async getMovieById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: "ID inválido." });
                return;
            }
            const movie = await this.getMovieByIdUseCase.execute(id);
            if (!movie) {
                res.status(404).json({ error: "Movie not found" });
                return;
            }
            res.status(200).json(movie);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
    }

    async updateMovie(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const data = req.body;
            if (isNaN(id)) {
                res.status(400).json({ error: "ID inválido." });
                return;
            }
            const updatedMovie = await this.updateMovieUseCase.execute(id, data);
            res.status(200).json(updatedMovie);
        } catch (error) {
            if (error instanceof Error && error.message === "Movie not found.") {
                res.status(404).json({ error: "Movie not found." });
                return;
            }
            res.status(500).json({ error: "Internal Server Error." });
        }
    }

    async deleteMovie(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: "ID inválido." });
                return;
            }
            await this.deleteMovieUseCase.execute(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error && error.message === "Movie not found.") {
                res.status(404).json({ error: "Movie not found." });
                return;
            }
            res.status(500).json({ error: "Internal Server Error." });
        }

    }

}