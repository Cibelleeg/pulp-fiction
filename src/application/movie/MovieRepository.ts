import type { Movie } from "../../domain/movie/Movie.js";

export type CreateMovieInput = Omit<Movie, "id">;

export interface MovieRepository {
    findAll(): Promise<Movie[]>;

    findById(id: number): Promise<Movie | null>;

    create(data: CreateMovieInput): Promise<Movie>;

    deleteById(id: number): Promise<void>;

    updateById(id: number, data: Omit<Movie, "id">): Promise<Movie>;
}