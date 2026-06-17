import type { MovieRepository, CreateMovieInput } from "../../application/movie/MovieRepository.js";
import type { Movie } from "../../domain/movie/Movie.js";


export class CreateMovieUseCase {
    constructor(private movieRepository: MovieRepository) { }

    async execute(data: CreateMovieInput): Promise<Movie> {
        const createdMovie = await this.movieRepository.create(data);
        return createdMovie;
    }   

}