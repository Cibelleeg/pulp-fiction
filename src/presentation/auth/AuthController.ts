import { LoginUseCase } from "../../application/user/LoginUseCase.js";
import type { Request, Response } from "express"

export class AuthController {
    constructor(private loginUseCase: LoginUseCase) {}

    async login(req: Request, res: Response): Promise<void> {
        try{
            const { email, password } = req.body;
            const result = await this.loginUseCase.execute(email, password);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ error: "Invalid credentials" })
        }
    }
}