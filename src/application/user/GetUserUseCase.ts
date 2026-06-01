import type { UserRepository } from "./UserRepository.js";
import type { User } from "../../domain/user/User.js";

export class GetUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(): Promise<User[]> {
        return await this.userRepository.findAll();
    }
}