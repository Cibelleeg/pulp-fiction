import { Router } from "express";
import { MovieController } from "./MovieController.js";
import { GetMoviesUseCase } from "../../application/movie/GetMoviesUseCase.js";
import { GetMovieByIdUseCase } from "../../application/movie/GetMovieByIdUseCase.js";
import { PrismaMovieRepository } from "../../infra/movie/PrismaMovieRepository.js";
import { CreateMovieUseCase } from "../../application/movie/CreateMovieUseCase.js";
import { UpdateMovieUseCase } from "../../application/movie/UpdateMovieUseCase.js";
import { DeleteMovieUseCase } from "../../application/movie/DeleteMovieUseCase.js";
import { authenticate } from "../../infra/http/middlewares/authenticate.js";
import { authorize } from "../../infra/http/middlewares/authorize.js";

const movieRepository = new PrismaMovieRepository();

const getMoviesUseCase = new GetMoviesUseCase(movieRepository);

const getMovieByIdUseCase = new GetMovieByIdUseCase(movieRepository);

const createMovieUseCase = new CreateMovieUseCase(movieRepository);

const deleteMovieUseCase = new DeleteMovieUseCase(movieRepository);

const updateMovieUseCase = new UpdateMovieUseCase(movieRepository);

const movieController = new MovieController(
    createMovieUseCase,
    getMoviesUseCase,
    getMovieByIdUseCase,
    updateMovieUseCase,
    deleteMovieUseCase
);

export const movieRouter = Router();

movieRouter.get("/", (req, res) => movieController.getMovies(req, res));

movieRouter.get("/:id", (req, res) => movieController.getMovieById(req, res));

movieRouter.post("/", authenticate, authorize('ADMIN'), (req, res) => movieController.createMovie(req, res));

movieRouter.put("/:id", authenticate, authorize('ADMIN'), (req, res) => movieController.updateMovie(req, res));

movieRouter.patch("/:id", authenticate, authorize('ADMIN'), (req, res) => movieController.updateMovie(req, res));

movieRouter.delete("/:id", authenticate, authorize('ADMIN'), (req, res) => movieController.deleteMovie(req, res));

