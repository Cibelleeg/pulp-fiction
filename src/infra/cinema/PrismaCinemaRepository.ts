import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";

import type { Cinema } from "../../domain/cinema/Cinema.js";
import type { CinemaRepository } from "../../application/cinema/CinemaRepository.js";

function createPrismaClient(): PrismaClient {
    const adapter = new PrismaPg({ connectionString: config.databaseUrl });
    return new PrismaClient({ adapter });
}

export class PrismaCinemaRepository implements CinemaRepository {
    constructor(private prisma: PrismaClient = createPrismaClient()) { }

    async findAll(): Promise<Cinema[]> {
        const cinemas = await this.prisma.cinema.findMany();
        return cinemas.map((cinema) => ({
            id: cinema.idCinema,
            name: cinema.nome,
            cnpj: cinema.cnpj,
            phoneNumber: cinema.telefone,
            email: cinema.email,
            address: "",
        }));
    }
}