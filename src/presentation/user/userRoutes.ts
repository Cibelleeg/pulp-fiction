import { Router } from "express";
import { UserController } from "./UserController.js";
import { GetUserUseCase } from "../../application/user/GetUserUseCase.js";
import { PrismaUserRepository } from "../../infra/user/PrismaUserRepository.js";
import { authorize } from "../../infra/http/middlewares/authorize.js";
import { authenticate } from "../../infra/http/middlewares/authenticate.js";



const userRepository = new PrismaUserRepository();
const getUserUseCase = new GetUserUseCase(userRepository);
const userController = new UserController(getUserUseCase);


const router = Router();

router.get("/", authenticate, authorize('ADMIN'), (req, res) => userController.getAllUsers(req, res));

export { router as userRoutes };
