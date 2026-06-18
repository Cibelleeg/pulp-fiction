import type { ReviewRepository, CreateReviewInput } from "./ReviewRepository.js";
import type { Review } from "../../domain/review/Review.js";

export class ReviewMovieUseCase {
    constructor(private reviewRepository: ReviewRepository) {}

    async execute(data: CreateReviewInput): Promise<Review> {   
        const hasWatched = await this.reviewRepository.hasUserWatchedMovie(data.userId, data.movieId);
        if (!hasWatched) {
            throw new Error("User has not watched this movie");
        }
        const existingReview = await this.reviewRepository.findByUserAndMovie(data.userId, data.movieId);
        if (existingReview) {
            throw new Error("User has already reviewed this movie");
        }
        return await this.reviewRepository.Create(data);
    }
}


