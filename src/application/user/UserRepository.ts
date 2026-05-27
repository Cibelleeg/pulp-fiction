import type { User } from "../../domain/user/User.js";


export interface UserRepository {
    findAll(): Promise<User[]>;
}