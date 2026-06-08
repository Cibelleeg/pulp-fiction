import { Router } from "express";
import { MovieController } from "./MovieController.js";
import { GetMoviesUseCase } from "../../application/movie/GetMoveisUseCase.js";
import { GetMovieByIdUseCase } from "../../application/movie/GetMovieByIdUseCase.js";
import { PrismaMovieRepository } from "../../infra/movie/PrismaMovieRepository.js";
import { CreateMovieUseCase } from "../../application/movie/CreateMovieUseCase.js";
import { UpdateMovieUseCase } from "../../application/movie/UpdateMovieUseCase.js";
import { DeleteMovieUseCase } from "../../application/movie/DeleteMovieUseCase.js";


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

movieRouter.post("/", (req, res) => movieController.createMovie(req, res));

movieRouter.get("/", (req, res) => movieController.getMovies(req, res));

movieRouter.get("/:id", (req, res) => movieController.getMovieById(req, res));

movieRouter.put("/:id", (req, res) => movieController.updateMovie(req, res));

movieRouter.delete("/:id", (req, res) => movieController.deleteMovie(req, res));

