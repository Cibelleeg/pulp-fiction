import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { UserRepository } from "./UserRepository.js";

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

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not defined');
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '1d' });
        return token;
    }
}