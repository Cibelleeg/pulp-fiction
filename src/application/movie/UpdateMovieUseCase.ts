import type { MovieRepository} from "../../application/movie/MovieRepository.js";
import type { Movie } from "../../domain/movie/Movie.js";


export class UpdateMovieUseCase {
    constructor(private movieRepository: MovieRepository) { }

    async execute(id: number, data: Omit<Movie, "id">): Promise<Movie> {
        const movie = await this.movieRepository.findById(id);
        if (!movie) {
            throw new Error(`Movie not found`);
        }
        const updatedMovie = await this.movieRepository.updateById(id, data);
        return updatedMovie;
    }
}