import type { CatalogRepository } from "./CatalogRepository.js";
import type { FilmeCatalogo } from "../../domain/catalog/CatalogMovie.js";


export class DeleteMovieUseCase {
    constructor(private catalogRepository: CatalogRepository) {}

    async execute(id: number): Promise<void> {
        const movie = await this.catalogRepository.findCatalogMovieById(id);
        if (!movie) {
            throw new Error(`Movie not found`);
        }
        await this.catalogRepository.deleteMovieById(id);
    }
}