import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import type { Prisma } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";

import type { Cinema } from "../../domain/cinema/Cinema.js";
import type { CinemaRepository, UpdateCinemaInput } from "../../application/cinema/CinemaRepository.js";

function createPrismaClient(): PrismaClient {
    const adapter = new PrismaPg({ connectionString: config.databaseUrl });
    return new PrismaClient({ adapter });
}

export class PrismaCinemaRepository implements CinemaRepository {
    constructor(private prisma: PrismaClient = createPrismaClient()) { }

    async findAll(): Promise<Cinema[]> {
        const cinemas = await this.prisma.cinema.findMany({ include: { endereco: true } });
        return cinemas.map((cinema) => ({
            id: cinema.idCinema,
            name: cinema.nome,
            cnpj: cinema.cnpj,
            phoneNumber: cinema.telefone,
            email: cinema.email,
            address: {
                id: cinema.endereco.idEndereco,
                logradouro: cinema.endereco.logradouro,
                numero: cinema.endereco.numero,
                bairro: cinema.endereco.bairro,
                cidade: cinema.endereco.cidade,
                estado: cinema.endereco.estado,
                cep: cinema.endereco.cep,
            },
        }))
    }

    async create (data: Omit<Cinema, "id" | "address"> & { address: Omit<Cinema["address"], "id"> }): Promise<Cinema> {
        const createdCinema = await this.prisma.cinema.create({
            data: {
                nome: data.name,
                cnpj: data.cnpj,
                telefone: data.phoneNumber,
                email: data.email,
                endereco: {
                    create: {
                        logradouro: data.address.logradouro,
                        numero: data.address.numero,
                        bairro: data.address.bairro,
                        cidade: data.address.cidade,
                        estado: data.address.estado,
                        cep: data.address.cep,
                    },
                },
            },
            include: { endereco: true },
        });

        return {
            id: createdCinema.idCinema,
            name: createdCinema.nome,
            cnpj: createdCinema.cnpj,
            phoneNumber: createdCinema.telefone,
            email: createdCinema.email,
            address: {
                id: createdCinema.endereco.idEndereco,
                logradouro: createdCinema.endereco.logradouro,
                numero: createdCinema.endereco.numero,
                bairro: createdCinema.endereco.bairro,
                cidade: createdCinema.endereco.cidade,
                estado: createdCinema.endereco.estado,
                cep: createdCinema.endereco.cep,
            },
        };
    }

    async findById(id: number): Promise<Cinema | null> {
        const cinema = await this.prisma.cinema.findUnique({
            where: { idCinema: id },
            include: { endereco: true },
        });

        if (!cinema) {
            console.error(`Cinema with ID ${id} not found.`);
            return null;
        };

        return {
            id: cinema.idCinema,
            name: cinema.nome,
            cnpj: cinema.cnpj,
            phoneNumber: cinema.telefone,
            email: cinema.email,
            address: {
                id: cinema.endereco.idEndereco,
                logradouro: cinema.endereco.logradouro,
                numero: cinema.endereco.numero,
                bairro: cinema.endereco.bairro,
                cidade: cinema.endereco.cidade,
                estado: cinema.endereco.estado,
                cep: cinema.endereco.cep,
            },
        };
    }


    async findByCnpj(cnpj: string): Promise<Cinema | null> {
        const cinema = await this.prisma.cinema.findUnique({
            where: { cnpj },
            include: { endereco: true },
        });

        if (!cinema) {
            console.error(`Cinema with CNPJ ${cnpj} not found.`);
            return null;
        }

        return {
            id: cinema.idCinema,
            name: cinema.nome,
            cnpj: cinema.cnpj,
            phoneNumber: cinema.telefone,
            email: cinema.email,
            address: {
                id: cinema.endereco.idEndereco,
                logradouro: cinema.endereco.logradouro,
                numero: cinema.endereco.numero,
                bairro: cinema.endereco.bairro,
                cidade: cinema.endereco.cidade,
                estado: cinema.endereco.estado,
                cep: cinema.endereco.cep,
            },
        };
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.cinema.delete({
            where: { idCinema: id },
        });
       
    }
    async updateById(id: number, data: UpdateCinemaInput): Promise<Cinema> {
        const updateData: Prisma.CinemaUpdateInput = {};

        if (data.name !== undefined) {
            updateData.nome = data.name;
        }
        if (data.cnpj !== undefined) {
            updateData.cnpj = data.cnpj;
        }
        if (data.phoneNumber !== undefined) {
            updateData.telefone = data.phoneNumber;
        }
        if (data.email !== undefined) {
            updateData.email = data.email;
        }

        if (data.address !== undefined) {
            const addressData: Prisma.EnderecoUpdateInput = {};
            if (data.address.logradouro !== undefined) {
                addressData.logradouro = data.address.logradouro;
            }
            if (data.address.numero !== undefined) {
                addressData.numero = data.address.numero;
            }
            if (data.address.bairro !== undefined) {
                addressData.bairro = data.address.bairro;
            }
            if (data.address.cidade !== undefined) {
                addressData.cidade = data.address.cidade;
            }
            if (data.address.estado !== undefined) {
                addressData.estado = data.address.estado;
            }
            if (data.address.cep !== undefined) {
                addressData.cep = data.address.cep;
            }

            if (Object.keys(addressData).length > 0) {
                updateData.endereco = { update: addressData };
            }
        }

        if (Object.keys(updateData).length === 0) {
            throw new Error("No data provided.");
        }

        const updatedCinema = await this.prisma.cinema.update({
            where: { idCinema: id },
            data: updateData,
            include: { endereco: true },
        });

        return {
            id: updatedCinema.idCinema,
            name: updatedCinema.nome,
            cnpj: updatedCinema.cnpj,
            phoneNumber: updatedCinema.telefone,
            email: updatedCinema.email,
            address: {
                id: updatedCinema.endereco.idEndereco,
                logradouro: updatedCinema.endereco.logradouro,
                numero: updatedCinema.endereco.numero,
                bairro: updatedCinema.endereco.bairro,
                cidade: updatedCinema.endereco.cidade,
                estado: updatedCinema.endereco.estado,
                cep: updatedCinema.endereco.cep,
            },
        };
    }
}