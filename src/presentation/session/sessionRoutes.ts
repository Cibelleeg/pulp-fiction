import { Router } from "express";
import { CreateSessionUseCase } from "../../application/session/CreateSessionUseCase.js";
import { DeleteSessionUseCase } from "../../application/session/DeleteSessionUseCase.js";
import { GetSessionByIdUseCase, GetSessionsUseCase } from "../../application/session/GetSessionsUseCase.js";
import { UpdateSessionUseCase } from "../../application/session/UpdateSessionUseCase.js";
import { authenticate } from "../../infra/http/middlewares/authenticate.js";
import { authorize } from "../../infra/http/middlewares/authorize.js";
import { PrismaSessionRepository } from "../../infra/session/PrismaSessionRepository.js";
import { SessionController } from "./SessionController.js";

const sessionRepository = new PrismaSessionRepository();

const createSessionUseCase = new CreateSessionUseCase(sessionRepository);
const getSessionsUseCase = new GetSessionsUseCase(sessionRepository);
const getSessionByIdUseCase = new GetSessionByIdUseCase(sessionRepository);
const updateSessionUseCase = new UpdateSessionUseCase(sessionRepository);
const deleteSessionUseCase = new DeleteSessionUseCase(sessionRepository);

const sessionController = new SessionController(
  createSessionUseCase,
  getSessionsUseCase,
  getSessionByIdUseCase,
  updateSessionUseCase,
  deleteSessionUseCase
);

export const sessionRoutes = Router();

sessionRoutes.get("/", (req, res) => sessionController.getSessions(req, res));

sessionRoutes.get("/:id", (req, res) => sessionController.getSessionById(req, res));

sessionRoutes.post("/", authenticate, authorize("ADMIN"), (req, res) => sessionController.createSession(req, res));

sessionRoutes.put("/:id", authenticate, authorize("ADMIN"), (req, res) => sessionController.updateSession(req, res));

sessionRoutes.patch("/:id", authenticate, authorize("ADMIN"), (req, res) => sessionController.updateSession(req, res));

sessionRoutes.delete("/:id", authenticate, authorize("ADMIN"), (req, res) => sessionController.deleteSession(req, res));
