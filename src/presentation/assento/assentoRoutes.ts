import { Router } from "express";
import { authenticate } from "../../infra/http/middlewares/authenticate.js";
import { authorize } from "../../infra/http/middlewares/authorize.js";
import { PrismaAssentoRepository } from "../../infra/assento/PrismaAssentoRepository.js";
import { CreateAssentoUseCase } from "../../application/assento/CreateAssentoUseCase.js";
import { GetAssentoByIdUseCase, GetAssentosBySalaUseCase, GetAssentosUseCase } from "../../application/assento/GetAssentosUseCase.js";
import { UpdateAssentoUseCase } from "../../application/assento/UpdateAssentoUseCase.js";
import { DeleteAssentoUseCase } from "../../application/assento/DeleteAssentoUseCase.js";
import { AssentoController } from "./AssentoController.js";

const assentoRepository = new PrismaAssentoRepository();

const assentoController = new AssentoController(
  new CreateAssentoUseCase(assentoRepository),
  new GetAssentosUseCase(assentoRepository),
  new GetAssentoByIdUseCase(assentoRepository),
  new GetAssentosBySalaUseCase(assentoRepository),
  new UpdateAssentoUseCase(assentoRepository),
  new DeleteAssentoUseCase(assentoRepository)
);

export const assentoRoutes = Router();

assentoRoutes.get("/", (req, res) => assentoController.getAssentos(req, res));
assentoRoutes.get("/sala/:idSala", (req, res) => assentoController.getAssentosBySala(req, res));
assentoRoutes.get("/:id", (req, res) => assentoController.getAssentoById(req, res));
assentoRoutes.post("/", authenticate, authorize("ADMIN"), (req, res) => assentoController.createAssento(req, res));
assentoRoutes.patch("/:id", authenticate, authorize("ADMIN"), (req, res) => assentoController.updateAssento(req, res));
assentoRoutes.delete("/:id", authenticate, authorize("ADMIN"), (req, res) => assentoController.deleteAssento(req, res));
