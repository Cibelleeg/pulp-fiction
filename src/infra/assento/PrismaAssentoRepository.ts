import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";
import type { Assento } from "../../domain/assento/Assento.js";
import type { AssentoRepository, CreateAssentoInput, UpdateAssentoInput } from "../../application/assento/AssentoRepository.js";

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: config.databaseUrl });
  return new PrismaClient({ adapter });
}

type PrismaAssento = {
  idAssento: number;
  idSala: number;
  numero: string;
  fila: string;
  tipo: string;
};

export class PrismaAssentoRepository implements AssentoRepository {
  constructor(private prisma: PrismaClient = createPrismaClient()) {}

  async findAll(): Promise<Assento[]> {
    const assentos = await this.prisma.assento.findMany({ orderBy: { idAssento: "asc" } });
    return assentos.map(this.toDomain);
  }

  async findById(id: number): Promise<Assento | null> {
    const assento = await this.prisma.assento.findUnique({ where: { idAssento: id } });
    if (!assento) return null;
    return this.toDomain(assento);
  }

  async findBySala(idSala: number): Promise<Assento[]> {
    const assentos = await this.prisma.assento.findMany({
      where: { idSala },
      orderBy: [{ fila: "asc" }, { numero: "asc" }],
    });
    return assentos.map(this.toDomain);
  }

  async create(data: CreateAssentoInput): Promise<Assento> {
    const assento = await this.prisma.assento.create({
      data: {
        idSala: data.idSala,
        numero: data.numero,
        fila: data.fila,
        tipo: data.tipo,
      },
    });
    return this.toDomain(assento);
  }

  async updateById(id: number, data: UpdateAssentoInput): Promise<Assento> {
    const updateData: Record<string, unknown> = {};
    if (data.numero !== undefined) updateData.numero = data.numero;
    if (data.fila !== undefined) updateData.fila = data.fila;
    if (data.tipo !== undefined) updateData.tipo = data.tipo;

    const assento = await this.prisma.assento.update({
      where: { idAssento: id },
      data: updateData,
    });
    return this.toDomain(assento);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.assento.delete({ where: { idAssento: id } });
  }

  private toDomain(assento: PrismaAssento): Assento {
    return {
      id: assento.idAssento,
      idSala: assento.idSala,
      numero: assento.numero,
      fila: assento.fila,
      tipo: assento.tipo,
    };
  }
}
