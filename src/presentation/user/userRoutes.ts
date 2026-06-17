import { Router } from "express";
import { UserController } from "./UserController.js";
import { GetUserUseCase } from "../../application/user/GetUserUseCase.js";
import { GetUserByIdUseCase } from "../../application/user/GetUserByIdUseCase.js";
import { CreateUserUseCase } from "../../application/user/CreateUserUseCase.js";
import { UpdateUserUseCase } from "../../application/user/UpdateUserUseCase.js";
import { DeleteUserUseCase } from "../../application/user/DeleteUserUseCase.js";
import { PrismaUserRepository } from "../../infra/user/PrismaUserRepository.js";
import { authorize } from "../../infra/http/middlewares/authorize.js";
import { authenticate } from "../../infra/http/middlewares/authenticate.js";


const userRepository = new PrismaUserRepository();
const getUserUseCase = new GetUserUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const userController = new UserController(getUserUseCase, getUserByIdUseCase, createUserUseCase, updateUserUseCase, deleteUserUseCase);


const router = Router();

router.get("/", authenticate, authorize('ADMIN'), (req, res) => userController.getAllUsers(req, res));
router.get("/:id", authenticate, authorize('ADMIN'), (req, res) => userController.getUserById(req, res));
router.post("/", (req, res) => userController.createUser(req, res));
router.patch("/:id", authenticate, (req, res) => userController.updateUser(req, res));
router.delete("/:id", authenticate, authorize('ADMIN'), (req, res) => userController.deleteUser(req, res));

export { router as userRoutes };
