import type { UserRepository } from "./UserRepository.js";
import type { User } from "../../domain/user/User.js";

export class GetUserByIdUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) throw new Error("User not found.");
        return user;
    }

}