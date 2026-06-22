import { Router } from "express";
import { ComboController } from "./ComboController.js";
import { GetCombosUseCase } from "../../application/combo/GetComboUseCase.js";
import { GetComboByIdUseCase } from "../../application/combo/GetComboByIdUseCase.js";
import { PrismaComboRepository } from "../../infra/combo/PrismaComboRepository.js";
import { CreateComboUseCase } from "../../application/combo/CreateComboUseCase.js";
import { DeleteComboUseCase } from "../../application/combo/DeleteComboUseCase.js";
import { UpdateComboUseCase } from "../../application/combo/UpdateComboUseCase.js";
import { authenticate } from "../../infra/http/middlewares/authenticate.js";
import { authorize } from "../../infra/http/middlewares/authorize.js";

const comboRepository = new PrismaComboRepository();

const controller = new ComboController(
  new GetCombosUseCase(comboRepository),
  new GetComboByIdUseCase(comboRepository),
  new CreateComboUseCase(comboRepository),
  new DeleteComboUseCase(comboRepository),
  new UpdateComboUseCase(comboRepository)
);

export const comboRoutes = Router();

comboRoutes.get("/", (req, res) => controller.getCombos(req, res));
comboRoutes.get("/:id", (req, res) => controller.getComboById(req, res));
comboRoutes.post("/", authenticate, authorize("ADMIN"), (req, res) => controller.createCombo(req, res));
comboRoutes.put("/:id", authenticate, authorize("ADMIN"), (req, res) => controller.updateCombo(req, res));
comboRoutes.patch("/:id", authenticate, authorize("ADMIN"), (req, res) => controller.updateCombo(req, res));
comboRoutes.delete("/:id", authenticate, authorize("ADMIN"), (req, res) => controller.deleteCombo(req, res));
