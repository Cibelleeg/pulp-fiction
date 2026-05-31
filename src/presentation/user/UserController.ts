import { GetUserUseCase } from "../../application/user/GetUserUseCase.js";
import type { Request, Response } from "express";


export class UserController {
    constructor(
        private getAllUsersUseCase: GetUserUseCase,
    ) { }

    async getAllUsers(req: Request, res: Response): Promise<void> {

        try {
            const users = await this.getAllUsersUseCase.execute();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
        
    }
}
