import type { CatalogRepository } from "./CatalogRepository.js";
import type { FilmeCatalogo } from "../../domain/catalog/CatalogMovie.js";

export class CreateMovieUseCase {
    constructor(private catalogRepository: CatalogRepository) { }

    async execute(data: Omit<FilmeCatalogo, "id">): Promise<FilmeCatalogo> {
        const createdMovie = await this.catalogRepository.createMovies(data);
        return createdMovie;
    }

}