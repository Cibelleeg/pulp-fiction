import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { UserRepository } from "./UserRepository.js";
import { config } from '../../config.js'

export class LoginUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid credentials.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
        }

        const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '1d' });
        return token;
    }
}