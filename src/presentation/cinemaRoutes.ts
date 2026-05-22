import { Router } from "express";
import { CinemaController } from "./CinemaController.js";
import { GetCinemaUseCase } from "../application/cinema/GetCinemaUseCase.js";
import { PrismaCinemaRepository } from "../infra/cinema/PrismaCinemaRepository.js";

const cinemaRepository = new PrismaCinemaRepository();
const useCase = new GetCinemaUseCase(cinemaRepository);
const cinemaController = new CinemaController(useCase);

const router = Router();

router.get("/", (req, res) => cinemaController.getAllCinemas(req, res));

export { router as cinemaRoutes };