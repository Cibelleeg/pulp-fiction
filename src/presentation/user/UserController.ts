import { GetUserUseCase } from "../../application/user/GetUserUseCase.js";
import { CreateUserUseCase } from "../../application/user/CreateUserUseCase.js";
import { GetUserByIdUseCase } from "../../application/user/GetUserByIdUseCase.js";
import { UpdateUserUseCase } from "../../application/user/UpdateUserUseCase.js";
import { DeleteUserUseCase } from "../../application/user/DeleteUserUseCase.js";
import type { Request, Response } from "express";


export class UserController {
    constructor(
        private getAllUsersUseCase: GetUserUseCase,
        private getUserByIdUseCase: GetUserByIdUseCase,
        private createUserUseCase: CreateUserUseCase,
        private updateUserUseCase: UpdateUserUseCase,
        private deleteUserUseCase: DeleteUserUseCase,
    ) { }

    async getAllUsers(req: Request, res: Response): Promise<void> {

        try {
            const users = await this.getAllUsersUseCase.execute();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
        
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, cpf, phoneNumber, birthDate } = req.body;
            const parsedBirthDate = new Date(birthDate);

            if (!birthDate || Number.isNaN(parsedBirthDate.getTime())) {
                res.status(400).json({ error: "Invalid birthDate." });
                return;
            }

            const user = await this.createUserUseCase.execute({
                name,
                email,
                password,
                cpf,
                phoneNumber,
                birthDate: parsedBirthDate,
            });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                res.status(400).json({ error: "ID inválido." });
                return;
            }

            await this.deleteUserUseCase.execute(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error && error.message === "User not found.") {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Internal Server Error." });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const user = await this.updateUserUseCase.execute(id, req.body);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                res.status(400).json({ error: "ID inválido." });
                return;
            }

            const user = await this.getUserByIdUseCase.execute(id);
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof Error && error.message === "User not found.") {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Internal Server Error." });
            }
        }

    }
}
