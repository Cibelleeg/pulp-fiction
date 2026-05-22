import { Router } from "express";
import { CinemaController } from "./CinemaController.js";
import { GetCinemaUseCase,  GetCinemaByIdUseCase } from "../application/cinema/GetCinemaUseCase.js";
import { PrismaCinemaRepository } from "../infra/cinema/PrismaCinemaRepository.js";

const cinemaRepository = new PrismaCinemaRepository();
const useCase = new GetCinemaUseCase(cinemaRepository);
const useCaseById = new GetCinemaByIdUseCase(cinemaRepository);
const cinemaController = new CinemaController(useCase, useCaseById);

const router = Router();

router.get("/", (req, res) => cinemaController.getAllCinemas(req, res));

router.get("/:id", (req, res) => cinemaController.getCinemaById(req, res));

export { router as cinemaRoutes };

