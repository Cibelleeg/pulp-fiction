import { ReviewMovieUseCase } from "../../application/review/ReviewMovieUseCase.js";
import type { CreateReviewInput } from "../../application/review/ReviewRepository.js";
import type { Request, Response } from "express";

export class ReviewController {
  constructor(
    private reviewMovieUseCase: ReviewMovieUseCase,
  ) {}

  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const { movieId, userId, rating, comment, reviewDate } = req.body as CreateReviewInput;

      if (!movieId || !userId || rating === undefined || !comment || !reviewDate) {
        res.status(400).json({ error: "Todos os campos são obrigatórios" });
        return;
      }

      const data: CreateReviewInput = { movieId, userId, rating, comment, reviewDate };
      const review = await this.reviewMovieUseCase.execute(data);
      res.status(201).json(review);

    } catch (error) {
      if (error instanceof Error && error.message === "User has not watched this movie") {
        res.status(403).json({ error: "Usuário não assistiu ao filme" });
        return;
      }
      if (error instanceof Error && error.message === "User has already reviewed this movie") {
        res.status(422).json({ error: "Usuário já avaliou esse filme" });
        return;
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}