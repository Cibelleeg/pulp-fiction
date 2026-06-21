import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";
import { Sessao } from "../../domain/session/Session.js";

import type { CreateSessionInput, SessionRepository, UpdateSessionInput } from "../../application/session/SessionRepository.js";

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: config.databaseUrl });
  return new PrismaClient({ adapter });
}

type PrismaSession = {
  idSessao: number;
  idFilme: number;
  idSala: number;
  dataHora: Date;
  idioma: string;
  formato: string;
  precoBase: number;
  sala?: {
    idCinema: number;
    nome: string;
    tipo: string;
    capacidade: number;
  } | null;
  ingressos?: unknown[];
};

export class PrismaSessionRepository implements SessionRepository {
  constructor(private prisma: PrismaClient = createPrismaClient()) {}

  async findAll(): Promise<Sessao[]> {
    const sessions = await this.prisma.sessao.findMany({
      include: {
        sala: true,
        ingressos: true,
      },
      orderBy: {
        dataHora: "asc",
      },
    });

    return sessions.map((session: PrismaSession) => this.toDomain(session));
  }

  async findById(id: number): Promise<Sessao | null> {
    const session = await this.prisma.sessao.findUnique({
      where: { idSessao: id },
      include: {
        sala: true,
        ingressos: true,
      },
    });

    if (!session) return null;

    return this.toDomain(session);
  }

  async create(data: CreateSessionInput): Promise<Sessao> {
    const createdSession = await this.prisma.sessao.create({
      data: {
        idFilme: data.movieId,
        idSala: data.roomId,
        dataHora: data.dateTime,
        idioma: data.language,
        formato: data.format,
        precoBase: data.basePrice,
      },
      include: {
        sala: true,
        ingressos: true,
      },
    });

    return this.toDomain(createdSession);
  }

  async updateById(id: number, data: UpdateSessionInput): Promise<Sessao> {
    const updateData: Record<string, unknown> = {};

    if (data.movieId !== undefined) updateData.idFilme = data.movieId;
    if (data.roomId !== undefined) updateData.idSala = data.roomId;
    if (data.dateTime !== undefined) updateData.dataHora = data.dateTime;
    if (data.language !== undefined) updateData.idioma = data.language;
    if (data.format !== undefined) updateData.formato = data.format;
    if (data.basePrice !== undefined) updateData.precoBase = data.basePrice;

    const updatedSession = await this.prisma.sessao.update({
      where: { idSessao: id },
      data: updateData,
      include: {
        sala: true,
        ingressos: true,
      },
    });

    return this.toDomain(updatedSession);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.sessao.delete({
      where: { idSessao: id },
    });
  }

  private toDomain(session: PrismaSession): Sessao {
    const totalSeats = session.sala?.capacidade ?? 0;
    const soldSeats = session.ingressos?.length ?? 0;

    return new Sessao(
      session.idSessao,
      session.idFilme,
      session.idSala,
      session.sala?.idCinema ?? 0,
      session.dataHora,
      session.idioma,
      session.formato,
      Number(session.precoBase),
      session.sala?.nome ?? "",
      session.sala?.tipo ?? "",
      totalSeats,
      totalSeats - soldSeats
    );
  }
}
