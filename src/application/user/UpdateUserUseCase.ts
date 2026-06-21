import bcrypt from "bcryptjs";
import type { UserRepository } from "./UserRepository.js";
import type { UpdateUserInput, User } from "../../domain/user/User.js";

export class UpdateUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(id: number, data: UpdateUserInput): Promise<User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found.");
        }

        if (data.email !== undefined) {

            const existingEmailUser = await this.userRepository.findByEmail(data.email);

            if (existingEmailUser && existingEmailUser.id !== id) {
                throw new Error("Email already in use.");
            }
        }

        if (data.cpf !== undefined) {
            const existingCpfUser = await this.userRepository.findByCpf(data.cpf);

            if (existingCpfUser && existingCpfUser.id !== id) {
                throw new Error("CPF already in use.");
            }
        }

        const input: UpdateUserInput = { ...data };

        if (data.password !== undefined) {
            input.password = await bcrypt.hash(data.password, 10);
        }

        if (Object.keys(input).length === 0) {
            throw new Error("No data provided.");
        }

        const updatedUser = await this.userRepository.update(id, input);

        return updatedUser;
    }
}