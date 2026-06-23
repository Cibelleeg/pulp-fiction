import { Router } from "express";
import { authenticate } from "../../infra/http/middlewares/authenticate.js";
import { ComprarIngressoUseCase } from "../../application/ingresso/ComprarIngressoUseCase.js";
import { PrismaIngressoRepository } from "../../infra/ingresso/PrismaIngressoRepository.js";
import { PrismaSessionRepository } from "../../infra/session/PrismaSessionRepository.js";
import { PrismaUserRepository } from "../../infra/user/PrismaUserRepository.js";
import { PrismaCatalogRepository } from "../../infra/catalog/PrismaCatalogRepository.js";
import { IngressoController } from "./IngressoController.js";

const ingressoRepository = new PrismaIngressoRepository();
const sessionRepository = new PrismaSessionRepository();
const userRepository = new PrismaUserRepository();
const movieRepository = new PrismaCatalogRepository();

const comprarIngressoUseCase = new ComprarIngressoUseCase(
  ingressoRepository,
  sessionRepository,
  userRepository,
  movieRepository
);

const ingressoController = new IngressoController(comprarIngressoUseCase);

export const ingressoRoutes = Router({ mergeParams: true });

ingressoRoutes.post("/", authenticate, (req, res) => ingressoController.comprarIngresso(req, res));
