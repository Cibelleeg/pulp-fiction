import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";
import type { Ingresso, StatusIngresso } from "../../domain/ingresso/Ingresso.js";
import { TypeIngresso } from "../../domain/ticketType/TicketType.js";
import type { CreateIngressoInput, IngressoRepository } from "../../application/ingresso/IngressoRepository.js";

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: config.databaseUrl });
  return new PrismaClient({ adapter });
}

type PrismaIngresso = {
  idIngresso: number;
  idSessao: number;
  idUsuario: number;
  idAssento: number;
  idPedido: number;
  tipo: string;
  preco: number;
  status: string;
  dataEmissao: Date;
};

export class PrismaIngressoRepository implements IngressoRepository {
  constructor(private prisma: PrismaClient = createPrismaClient()) {}

  async findById(id: number): Promise<Ingresso | null> {
    const ingresso = await this.prisma.ingresso.findUnique({
      where: { idIngresso: id },
    });

    if (!ingresso) return null;

    return this.toDomain(ingresso);
  }

  async findBySessaoAndAssento(idSessao: number, idAssento: number): Promise<Ingresso | null> {
    const ingresso = await this.prisma.ingresso.findUnique({
      where: {
        idSessao_idAssento: { idSessao, idAssento },
      },
    });

    if (!ingresso) return null;

    return this.toDomain(ingresso);
  }

  async countMeiasBySessao(idSessao: number): Promise<number> {
    return await this.prisma.ingresso.count({
      where: { idSessao, tipo: TypeIngresso.MEIA },
    });
  }

  async create(data: CreateIngressoInput): Promise<Ingresso> {
    const ingresso = await this.prisma.ingresso.create({
      data: {
        idSessao: data.idSessao,
        idUsuario: data.idUsuario,
        idAssento: data.idAssento,
        idPedido: data.idPedido,
        tipo: data.tipo,
        preco: data.preco,
        status: data.status,
        dataEmissao: data.dataEmissao,
      },
    });

    return this.toDomain(ingresso);
  }

  private toDomain(ingresso: PrismaIngresso): Ingresso {
    return {
      idIngresso: ingresso.idIngresso,
      idSessao: ingresso.idSessao,
      idUsuario: ingresso.idUsuario,
      idAssento: ingresso.idAssento,
      idPedido: ingresso.idPedido,
      tipo: ingresso.tipo as TypeIngresso,
      preco: Number(ingresso.preco),
      status: ingresso.status as StatusIngresso,
      dataEmissao: ingresso.dataEmissao,
    };
  }
}
