import { Router } from "express";
import { CinemaController } from "./CinemaController.js";
import { GetCinemaUseCase,  GetCinemaByIdUseCase} from "../../application/cinema/GetCinemaUseCase.js";
import { DeleteCinemaByIdUseCase } from "../../application/cinema/DeleteCinemaUseCase.js";
import { UpdateCinemaByIdUseCase } from "../../application/cinema/UpdateCinemaUseCase.js";
import { CreateCinemaUseCase } from "../../application/cinema/CreateCinemaUseCase.js";
import { PrismaCinemaRepository } from "../../infra/cinema/PrismaCinemaRepository.js";
import { authenticate } from "../../infra/http/middlewares/authenticate.js";
import { authorize } from "../../infra/http/middlewares/authorize.js";

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

router.post("/", authenticate, authorize('ADMIN'), (req, res) => cinemaController.createCinema(req, res));

router.delete("/:id", authenticate, authorize('ADMIN'), (req, res) => cinemaController.deleteCinemaById(req, res));

router.patch("/:id", authenticate, authorize('ADMIN'), (req, res) => cinemaController.updateCinemaById(req, res));

export { router as cinemaRoutes };
