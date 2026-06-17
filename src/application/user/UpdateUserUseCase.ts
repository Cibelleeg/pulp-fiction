import bcrypt from "bcryptjs";
import type { UserRepository } from "./UserRepository.js";
import type { UpdateUserInput, User } from "../../domain/user/User.js";

export class UpdateUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(id: number, data: UpdateUserInput): Promise<User> {
        const input: UpdateUserInput = { ...data };
        if (data.password) {
            input.password = await bcrypt.hash(data.password, 10);
        }
        return this.userRepository.update(id, input);
    }
}
