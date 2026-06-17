import type { MovieRepository} from "../../application/movie/MovieRepository.js";


export class DeleteMovieUseCase {
    constructor(private movieRepository: MovieRepository) {}

    async execute(id: number): Promise<void> {
        const movie = await this.movieRepository.findById(id);
        if (!movie) {
            throw new Error(`Movie not found`);
        }
        await this.movieRepository.deleteById(id);
    }
}