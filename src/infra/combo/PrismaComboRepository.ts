import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";

import type { Combo } from "../../domain/combo/Combo.js";
import type { ComboRepository, CreateComboInput, UpdateComboInput } from "../../application/combo/ComboRepository.js";

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: config.databaseUrl });
  return new PrismaClient({ adapter });
}

function mapCombo(raw: any): Combo {
  return {
    id: raw.idCombo,
    nome: raw.nome,
    descricao: raw.descricao,
    preco: raw.preco,
    ativo: raw.ativo,
    poster: raw.poster,
    itens: raw.itens?.map((i: any) => ({
      idItemCombo: i.idItemCombo,
      idCombo: i.idCombo,
      idProduto: i.idProduto,
      quantidade: i.quantidade,
    })),
  };
}

export class PrismaComboRepository implements ComboRepository {
  constructor(private prisma: PrismaClient = createPrismaClient()) {}

  async findAll(): Promise<Combo[]> {
    const combos = await this.prisma.combo.findMany({ include: { itens: true } });
    return combos.map(mapCombo);
  }

  async findById(id: number): Promise<Combo | null> {
    const combo = await this.prisma.combo.findUnique({
      where: { idCombo: id },
      include: { itens: true },
    });
    if (!combo) return null;
    return mapCombo(combo);
  }

  async create(data: CreateComboInput): Promise<Combo> {
    const created = await this.prisma.combo.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        ativo: data.ativo ?? true,
        poster: data.poster ?? null,
        itens: {
          create: data.itens.map((item) => ({
            idProduto: item.idProduto,
            quantidade: item.quantidade,
          })),
        },
      },
      include: { itens: true },
    });
    return mapCombo(created);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.itemCombo.deleteMany({ where: { idCombo: id } });
    await this.prisma.combo.delete({ where: { idCombo: id } });
  }

  async updateById(id: number, data: UpdateComboInput): Promise<Combo> {
    const updateData: Record<string, unknown> = {};
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.preco !== undefined) updateData.preco = data.preco;
    if (data.ativo !== undefined) updateData.ativo = data.ativo;
    if (data.poster !== undefined) updateData.poster = data.poster;

    const updated = await this.prisma.combo.update({
      where: { idCombo: id },
      data: updateData,
      include: { itens: true },
    });
    return mapCombo(updated);
  }
}
