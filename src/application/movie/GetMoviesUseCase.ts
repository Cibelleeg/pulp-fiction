import type { MovieRepository} from "../../application/movie/MovieRepository.js";
import type { Movie } from "../../domain/movie/Movie.js";

export class GetMoviesUseCase {
    constructor(private movieRepository: MovieRepository) {}

    async execute(): Promise<Movie[]> {
        return await this.movieRepository.findAll();
    }
}