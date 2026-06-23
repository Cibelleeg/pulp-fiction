import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";
import type { Sala } from "../../domain/sala/Sala.js";
import type { CreateSalaInput, SalaRepository, UpdateSalaInput } from "../../application/sala/SalaRepository.js";

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: config.databaseUrl });
  return new PrismaClient({ adapter });
}

type PrismaSala = {
  idSala: number;
  idCinema: number;
  nome: string;
  capacidade: number;
  tipo: string;
};

export class PrismaSalaRepository implements SalaRepository {
  constructor(private prisma: PrismaClient = createPrismaClient()) {}

  async findAll(): Promise<Sala[]> {
    const salas = await this.prisma.sala.findMany({ orderBy: { idSala: "asc" } });
    return salas.map(this.toDomain);
  }

  async findById(id: number): Promise<Sala | null> {
    const sala = await this.prisma.sala.findUnique({ where: { idSala: id } });
    if (!sala) return null;
    return this.toDomain(sala);
  }

  async findByCinema(idCinema: number): Promise<Sala[]> {
    const salas = await this.prisma.sala.findMany({
      where: { idCinema },
      orderBy: { idSala: "asc" },
    });
    return salas.map(this.toDomain);
  }

  async create(data: CreateSalaInput): Promise<Sala> {
    const sala = await this.prisma.sala.create({
      data: {
        idCinema: data.idCinema,
        nome: data.nome,
        capacidade: data.capacidade,
        tipo: data.tipo,
      },
    });
    return this.toDomain(sala);
  }

  async updateById(id: number, data: UpdateSalaInput): Promise<Sala> {
    const updateData: Record<string, unknown> = {};
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.capacidade !== undefined) updateData.capacidade = data.capacidade;
    if (data.tipo !== undefined) updateData.tipo = data.tipo;

    const sala = await this.prisma.sala.update({
      where: { idSala: id },
      data: updateData,
    });
    return this.toDomain(sala);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.sala.delete({ where: { idSala: id } });
  }

  private toDomain(sala: PrismaSala): Sala {
    return {
      id: sala.idSala,
      idCinema: sala.idCinema,
      nome: sala.nome,
      capacidade: sala.capacidade,
      tipo: sala.tipo,
    };
  }
}
