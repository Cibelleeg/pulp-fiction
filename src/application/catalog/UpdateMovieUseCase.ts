import type { CatalogRepository } from "./CatalogRepository.js";
import type { FilmeCatalogo } from "../../domain/catalog/CatalogMovie.js";

export class UpdateMovieUseCase {
    constructor(private catalogRepository: CatalogRepository) { }

    async execute(id: number, data: Omit<FilmeCatalogo, "id">): Promise<FilmeCatalogo> {
        const movie = await this.catalogRepository.findCatalogMovieById(id);
        if (!movie) {
            throw new Error(`Movie not found`);
        }
        const updatedMovie = await this.catalogRepository.updateMovieById(id, data);
        return updatedMovie;
    }
}