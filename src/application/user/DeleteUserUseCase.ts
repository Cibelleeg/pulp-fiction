import type { UserRepository } from "./UserRepository.js";

export class DeleteUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(id: number): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error("User not found.");
        }
        await this.userRepository.delete(id);
    }
}
