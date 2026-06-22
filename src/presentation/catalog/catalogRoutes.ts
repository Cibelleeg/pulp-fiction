import { Router } from "express";
import { CreateMovieReviewUseCase } from "../../application/catalog/CreateMovieReviewUseCase.js";
import { DeleteReviewUseCase } from "../../application/catalog/DeleteReviewUseCase.js";
import { GetCatalogMovieDetailUseCase } from "../../application/catalog/GetCatalogMovieDetailUseCase.js";
import { ListCatalogMoviesUseCase } from "../../application/catalog/ListCatalogMoviesUseCase.js";
import { ListMovieReviewsUseCase } from "../../application/catalog/ListMovieReviewsUseCase.js";
import { UpdateReviewUseCase } from "../../application/catalog/UpdateReviewUseCase.js";
import { config } from "../../config.js";
import { authenticate } from "../../infra/http/middlewares/authenticate.js";
import { optionalAuthenticate } from "../../infra/http/middlewares/optionalAuthenticate.js";
import { PrismaCatalogRepository } from "../../infra/catalog/PrismaCatalogRepository.js";
import { CatalogController } from "./CatalogController.js";

const catalogRepository = new PrismaCatalogRepository();
const minimoAvaliacoesRanking = config.minimoAvaliacoesRanking;

const controller = new CatalogController(
  new ListCatalogMoviesUseCase(catalogRepository, minimoAvaliacoesRanking),
  new GetCatalogMovieDetailUseCase(catalogRepository, minimoAvaliacoesRanking),
  new ListMovieReviewsUseCase(catalogRepository),
  new CreateMovieReviewUseCase(catalogRepository),
  new UpdateReviewUseCase(catalogRepository),
  new DeleteReviewUseCase(catalogRepository),
);

export const catalogRoutes = Router();
export const reviewRoutes = Router();

catalogRoutes.get("/", (req, res) => controller.listMovies(req, res));
catalogRoutes.get("/:id", optionalAuthenticate, (req, res) => controller.getMovieDetail(req, res));
catalogRoutes.get("/:id/avaliacoes", (req, res) => controller.listMovieReviews(req, res));
catalogRoutes.post("/:id/avaliacoes", authenticate, (req, res) => controller.createMovieReview(req, res));

reviewRoutes.patch("/:id", authenticate, (req, res) => controller.updateReview(req, res));
reviewRoutes.delete("/:id", authenticate, (req, res) => controller.deleteReview(req, res));
