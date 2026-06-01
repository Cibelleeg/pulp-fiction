import { prisma } from "../PrismaClient.js";

import type { AuthenticatedUser, User } from "../../domain/user/User.js";
import type { UserRepository } from "../../application/user/UserRepository.js";

export class PrismaUserRepository implements UserRepository {

    async findAll(): Promise<User[]> {
        const users = await prisma.usuario.findMany();
        return users.map((user) => ({
            id: user.idUsuario,
            name: user.nome,
            email: user.email,
            cpf: user.cpf,
            phoneNumber: user.telefone,
            birthDate: user.dataNascimento,
            role: user.role
        }))
    }

    async findByEmail(email: string): Promise<AuthenticatedUser | null> {
        const user = await prisma.usuario.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            return null;
        }
        return {
            id: user.idUsuario,
            password: user.senha,
            role: user.role
        };
    }
}