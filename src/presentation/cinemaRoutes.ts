import { Router } from "express";
import { CinemaController } from "./CinemaController.js";
import { GetCinemaUseCase } from "../application/cinema/GetCinemaUseCase.js";
import { CreateCinemaUseCase } from "../application/cinema/CreateCinemaUseCase.js";
import { PrismaCinemaRepository } from "../infra/cinema/PrismaCinemaRepository.js";

const cinemaRepository = new PrismaCinemaRepository();
const getCinemaUseCase = new GetCinemaUseCase(cinemaRepository);
const createCinemaUseCase = new CreateCinemaUseCase(cinemaRepository);
const cinemaController = new CinemaController(getCinemaUseCase, createCinemaUseCase);

const router = Router();

router.get("/", (req, res) => cinemaController.getAllCinemas(req, res));

router.post("/", (req, res) => cinemaController.createCinema(req, res));

export { router as cinemaRoutes };