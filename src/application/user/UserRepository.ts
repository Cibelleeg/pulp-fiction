import type { AuthenticatedUser, CreateUserInput, UpdateUserInput, User } from "../../domain/user/User.js";


export interface UserRepository {
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<AuthenticatedUser | null>;
    findById(id: number): Promise<User | null>;
    create(input: CreateUserInput): Promise<User>;
    update(id: number, input: UpdateUserInput): Promise<User>;
    delete(id: number): Promise<void>;
}