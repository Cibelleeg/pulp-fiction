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

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {

                res.status(400).json({ error: "Invalid email format." });
                return;
            }
            
            let parsedBirthDate: Date | undefined;
            if (birthDate !== undefined) {
                parsedBirthDate = new Date(birthDate);
                if (Number.isNaN(parsedBirthDate.getTime())) {
                    res.status(400).json({ error: "Invalid birthDate." });
                    return;
                }
            }

            const user = await this.createUserUseCase.execute({
                email,
                password,
                ...(name !== undefined && { name }),
                ...(cpf !== undefined && { cpf }),
                ...(phoneNumber !== undefined && { phoneNumber }),
                ...(parsedBirthDate !== undefined && { birthDate: parsedBirthDate }),
            });
            res.status(201).json(user);
        } catch (error) {

            if (error instanceof Error) {

                if (error.message.includes("`cpf`")) {
                    res.status(409).json({ error: "CPF already exists." });
                    return;
                }

                if (error.message.includes("`email`")) {
                    res.status(409).json({ error: "Email already exists." });
                    return;
                }

                res.status(500).json({ error: error.message });
                return;
            }

            res.status(500).json({ error: "Internal Server Error." });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                res.status(400).json({ error: "Invalid ID." });
                return;
            }

            await this.deleteUserUseCase.execute(id);
            res.status(204).json({message: "User deleted successfully."});
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

            if (Number.isNaN(id)) {
                res.status(400).json({ error: "Invalid ID." });
                return;
            }

            const isAdmin = req.user?.role === "ADMIN";
            if (!isAdmin && req.user?.id !== id) {
                res.status(403).json({ message: "Forbidden" });
                return;
            }

            const { role, birthDate, ...rest } = req.body ?? {};
            const data: any = { ...rest };

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(data.email)) {
                res.status(400).json({ error: "Invalid email format." });
                return;
            }

            if (birthDate !== undefined) {
                const parsedBirthDate = new Date(birthDate as string);
                if (Number.isNaN(parsedBirthDate.getTime())) {
                    res.status(400).json({ error: "Invalid birthDate." });
                    return;
                }
                data.birthDate = parsedBirthDate;
            }

            if (isAdmin && role !== undefined) {
                data.role = role;
            }

            const user = await this.updateUserUseCase.execute(id, data);
            res.status(200).json({ message: "User updated successfully.", user });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Internal Server Error." });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                res.status(400).json({ error: "Invalid ID." });
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
