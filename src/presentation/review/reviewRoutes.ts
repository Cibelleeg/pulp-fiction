import { Router } from "express";
import { ReviewController } from "./ReviewController.js";
import { ReviewMovieUseCase } from "../../application/review/ReviewMovieUseCase.js";
import { PrismaReviewRepository } from "../../infra/review/PrismaReviewRepository.js";



const reviewRepository = new PrismaReviewRepository();
const reviewMovieUseCase = new ReviewMovieUseCase(reviewRepository);
const reviewController = new ReviewController(reviewMovieUseCase);

const router = Router();

router.post("/", (req, res) => reviewController.createReview(req, res));

export { router as reviewRoutes };

