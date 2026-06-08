import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";

import type { Movie } from "../../domain/movie/Movie.js";
import type { MovieRepository, CreateMovieInput } from "../../application/movie/MovieRepository.js";

function createPrismaClient(): PrismaClient {
    const adapter = new PrismaPg({ connectionString: config.databaseUrl });
    return new PrismaClient({ adapter });
}
export class PrismaMovieRepository implements MovieRepository {
      constructor(private prisma: PrismaClient = createPrismaClient()) { }


    async findAll(): Promise<Movie[]> {
        const movies = await this.prisma.filme.findMany();
        return movies.map((movie: any) => ({
            id: movie.idFilme,
            title: movie.titulo,
            synopsis: movie.sinopse,
            duration: movie.duracao,
            ageRating: movie.classificacaoIndicativa,
            genre: movie.genero,
            releaseDate: movie.dataLancamento,
        }));
    }

    async findById(id: number): Promise<Movie | null> {
        const movie = await this.prisma.filme.findUnique({
            where: { idFilme: id },
        });

        if (!movie) return null;
        
        return {
            id: movie.idFilme,
            title: movie.titulo,
            synopsis: movie.sinopse,
            duration: movie.duracao,
            ageRating: movie.classificacaoIndicativa,
            genre: movie.genero,
            releaseDate: movie.dataLancamento,
        };
    }

    async create(data: CreateMovieInput): Promise<Movie> {
        const createdMovie = await this.prisma.filme.create({
            data: {
                titulo: data.title,
                sinopse: data.synopsis,
                duracao: data.duration,
                classificacaoIndicativa: data.ageRating,
                genero: data.genre,
                dataLancamento: data.releaseDate,
            },
        });
        return {
            id: createdMovie.idFilme,
            title: createdMovie.titulo,
            synopsis: createdMovie.sinopse,
            duration: createdMovie.duracao,
            ageRating: createdMovie.classificacaoIndicativa,
            genre: createdMovie.genero,
            releaseDate: createdMovie.dataLancamento,
        };
    }

    async deleteById(id: number): Promise<void> {
         await this.prisma.filme.findUnique({ where: { idFilme: id },
    
        });
    }

    async updateById(id: number, data: Omit<Movie, "id">): Promise<Movie> {
        const updatedMovie = await this.prisma.filme.update({
            where: { idFilme: id },
            data: {
                titulo: data.title,
                sinopse: data.synopsis,
                duracao: data.duration,
                classificacaoIndicativa: data.ageRating,
                genero: data.genre,
                dataLancamento: data.releaseDate,
            },  
        });
        return {
            id: updatedMovie.idFilme,
            title: updatedMovie.titulo,
            synopsis: updatedMovie.sinopse,
            duration: updatedMovie.duracao,
            ageRating: updatedMovie.classificacaoIndicativa,
            genre: updatedMovie.genero,
            releaseDate: updatedMovie.dataLancamento,
        };
    }
}