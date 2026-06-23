import { Router } from "express";
import { authenticate } from "../../infra/http/middlewares/authenticate.js";
import { authorize } from "../../infra/http/middlewares/authorize.js";
import { PrismaSalaRepository } from "../../infra/sala/PrismaSalaRepository.js";
import { CreateSalaUseCase } from "../../application/sala/CreateSalaUseCase.js";
import { GetSalaByIdUseCase, GetSalasByCinemaUseCase, GetSalasUseCase } from "../../application/sala/GetSalasUseCase.js";
import { UpdateSalaUseCase } from "../../application/sala/UpdateSalaUseCase.js";
import { DeleteSalaUseCase } from "../../application/sala/DeleteSalaUseCase.js";
import { SalaController } from "./SalaController.js";

const salaRepository = new PrismaSalaRepository();

const salaController = new SalaController(
  new CreateSalaUseCase(salaRepository),
  new GetSalasUseCase(salaRepository),
  new GetSalaByIdUseCase(salaRepository),
  new GetSalasByCinemaUseCase(salaRepository),
  new UpdateSalaUseCase(salaRepository),
  new DeleteSalaUseCase(salaRepository)
);

export const salaRoutes = Router();

salaRoutes.get("/", (req, res) => salaController.getSalas(req, res));
salaRoutes.get("/cinema/:idCinema", (req, res) => salaController.getSalasByCinema(req, res));
salaRoutes.get("/:id", (req, res) => salaController.getSalaById(req, res));
salaRoutes.post("/", authenticate, authorize("ADMIN"), (req, res) => salaController.createSala(req, res));
salaRoutes.patch("/:id", authenticate, authorize("ADMIN"), (req, res) => salaController.updateSala(req, res));
salaRoutes.delete("/:id", authenticate, authorize("ADMIN"), (req, res) => salaController.deleteSala(req, res));
