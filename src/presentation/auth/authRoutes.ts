import { Router } from "express"
import { AuthController } from "./AuthController.js"
import { LoginUseCase } from "../../application/user/LoginUseCase.js"
import { PrismaUserRepository } from "../../infra/user/PrismaUserRepository.js"

const userRepository = new PrismaUserRepository()
const loginUseCase = new LoginUseCase(userRepository)
const authController = new AuthController(loginUseCase)

const router = Router()
router.post("/login", (req, res) => authController.login(req, res))
export { router as authRoutes }
