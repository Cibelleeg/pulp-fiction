import bcrypt from "bcryptjs";
import type { UserRepository } from "./UserRepository.js";
import type { CreateUserInput, User } from "../../domain/user/User.js";

export class CreateUserUseCase {
    constructor(private userRepository: UserRepository) {}
    
    async execute(data: CreateUserInput): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.userRepository.create({ ...data, password: hashedPassword });
    }
}