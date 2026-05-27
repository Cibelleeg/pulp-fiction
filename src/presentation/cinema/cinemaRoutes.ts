import { Router } from "express";
import { CinemaController } from "./CinemaController.js";
import { GetCinemaUseCase,  GetCinemaByIdUseCase} from "../../application/cinema/GetCinemaUseCase.js";
import { DeleteCinemaByIdUseCase } from "../application/cinema/DeleteCinemaUseCase.js";
import { UpdateCinemaByIdUseCase } from "../application/cinema/UpdateCinemaUseCase.js";
import { CreateCinemaUseCase } from "../../application/cinema/CreateCinemaUseCase.js";
import { PrismaCinemaRepository } from "../../infra/cinema/PrismaCinemaRepository.js";

const cinemaRepository = new PrismaCinemaRepository();

const getCinemaByIdUseCase = new GetCinemaByIdUseCase(cinemaRepository);

const getCinemaUseCase = new GetCinemaUseCase(cinemaRepository);

const createCinemaUseCase = new CreateCinemaUseCase(cinemaRepository);

const deleteCinemaByIdUseCase = new DeleteCinemaByIdUseCase(cinemaRepository);

const updateCinemaByIdUseCase = new UpdateCinemaByIdUseCase(cinemaRepository);

const cinemaController = new CinemaController(getCinemaUseCase, getCinemaByIdUseCase, createCinemaUseCase,  deleteCinemaByIdUseCase, updateCinemaByIdUseCase);


const router = Router();

router.get("/", (req, res) => cinemaController.getAllCinemas(req, res));

router.get("/:id", (req, res) => cinemaController.getCinemaById(req, res));

router.post("/", (req, res) => cinemaController.createCinema(req, res));

router.delete("/:id", (req, res) => cinemaController.deleteCinemaById(req, res));

router.patch("/:id", (req, res) => cinemaController.updateCinemaById(req, res));

export { router as cinemaRoutes };
