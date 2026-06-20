import { prisma } from "../PrismaClient.js";
import type { Prisma } from "../../../generated/prisma/client.js";

import type { AuthenticatedUser, CreateUserInput, UpdateUserInput, User } from "../../domain/user/User.js";
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

    async findById(id: number): Promise<User | null> {
        const user = await prisma.usuario.findUnique({
            where: {
                idUsuario: id
            }
        });
        if (!user) {
            return null;
        }
        return {
            id: user.idUsuario,
            name: user.nome,
            email: user.email,
            cpf: user.cpf,
            phoneNumber: user.telefone,
            birthDate: user.dataNascimento,
            role: user.role
        };
    }

    async delete(id: number): Promise<void> {
        await prisma.usuario.delete({ where: { idUsuario: id } });
    }

    async update(id: number, input: UpdateUserInput): Promise<User> {
        const data = Object.fromEntries(
            Object.entries({ nome: input.name, email: input.email, senha: input.password, cpf: input.cpf, telefone: input.phoneNumber, dataNascimento: input.birthDate, role: input.role })
            .filter(([, v]) => v !== undefined)
        ) as Prisma.UsuarioUpdateInput;

        const user = await prisma.usuario.update({
            where: { idUsuario: id },
            data
        });
        return {
            id: user.idUsuario,
            name: user.nome,
            email: user.email,
            cpf: user.cpf,
            phoneNumber: user.telefone,
            birthDate: user.dataNascimento,
            role: user.role
        };
    }

    async create(input: CreateUserInput): Promise<User> {
        const user = await prisma.usuario.create({
            data: {
                nome: input.name ?? null,
                email: input.email,
                senha: input.password,
                cpf: input.cpf ?? null,
                telefone: input.phoneNumber ?? null,
                dataNascimento: input.birthDate ?? null,
                role: input.role || 'USER'
            }
        });
        return {
            id: user.idUsuario,
            name: user.nome,
            email: user.email,
            cpf: user.cpf,
            phoneNumber: user.telefone,
            birthDate: user.dataNascimento,
            role: user.role
        };
    }
}