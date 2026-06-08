import type { MovieRepository} from "../../application/movie/MovieRepository.js";
import type { Movie } from "../../domain/movie/Movie.js";

export class GetMovieByIdUseCase {
    constructor(private movieRepository: MovieRepository) {}

    async execute(id: number): Promise<Movie | null> {
        return await this.movieRepository.findById(id);
    }
}