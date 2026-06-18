import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";
import type { Review } from "../../domain/review/Review.js";
import type { CreateReviewInput, ReviewRepository } from "../../application/review/ReviewRepository.js";


function createPrismaClient(): PrismaClient {
    const adapter = new PrismaPg({ connectionString: config.databaseUrl });
    return new PrismaClient({ adapter });
}

export class PrismaReviewRepository implements ReviewRepository {
    constructor(private prisma: PrismaClient = createPrismaClient()) { }

    async Create(data: CreateReviewInput): Promise<Review> {
        const createdReview = await this.prisma.avaliacao.create({
            data: {
                idFilme: data.movieId,
                idUsuario: data.userId,
                nota: data.rating,
                comentario: data.comment,
                data_avaliacao: data.reviewDate,
            },
        });
        return {
            id: createdReview.idAvaliacao,
            movieId: createdReview.idFilme,
            userId: createdReview.idUsuario,
            rating: createdReview.nota,
            comment: createdReview.comentario,
            reviewDate: createdReview.data_avaliacao,
        };

    }

    async findByUserAndMovie(userId: number, movieId: number): Promise<Review | null> {
        const review = await this.prisma.avaliacao.findFirst({
            where: {
                idUsuario: userId,
                idFilme: movieId,
            },
        });
        if (!review) return null;
        return {
            id: review.idAvaliacao,
            movieId: review.idFilme,
            userId: review.idUsuario,
            rating: review.nota,
            comment: review.comentario,
            reviewDate: review.data_avaliacao,
        };
    }

    async hasUserWatchedMovie(userId: number, movieId: number): Promise<boolean> {
        const ingresso = await this.prisma.ingresso.findFirst({
            where: {
                idUsuario: userId,
                sessao: {
                    idFilme: movieId,
                    dataHora: {
                        lt: new Date(),
                    },
                },
            },
        });

        return ingresso !== null;
    }

    
}