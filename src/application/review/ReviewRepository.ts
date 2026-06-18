import type { Review } from "../../domain/review/Review.js";

export type CreateReviewInput = Omit<Review, "id">;

export interface ReviewRepository {
    Create(data: CreateReviewInput): Promise<Review>

    findByUserAndMovie(userId: number, movieId: number): Promise<Review | null>;

    hasUserWatchedMovie(userId: number, movieId: number): Promise<boolean>;
    
}