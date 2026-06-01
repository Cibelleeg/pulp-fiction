import type { AuthenticatedUser, User } from "../../domain/user/User.js";


export interface UserRepository {
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<AuthenticatedUser | null>;
}