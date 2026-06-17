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

        const input: UpdateUserInput = { ...data };
        if (data.password !== undefined) {
            input.password = await bcrypt.hash(data.password, 10);
        }
        return this.userRepository.update(id, input);
    }
}
