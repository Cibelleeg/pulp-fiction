import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";
import { FilmeCatalogo } from "../../domain/catalog/CatalogMovie.js";
import { EstatisticaAvaliacoes, distribuicaoVazia } from "../../domain/catalog/ReviewStats.js";

import type {
  CatalogRepository,
  ReviewListItem,
  StoredReview,
} from "../../application/catalog/CatalogRepository.js";
import type { DistribuicaoAvaliacoes } from "../../domain/catalog/ReviewStats.js";

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: config.databaseUrl });
  return new PrismaClient({ adapter });
}

type FilmeRaw = {
  idFilme: number;
  titulo: string;
  sinopse: string;
  duracao: number;
  classificacaoIndicativa: number;
  genero: string;
  dataLancamento: Date;
  dataFimCartaz: Date | null;
  poster: string | null;
};

type AvaliacaoRaw = {
  idAvaliacao: number;
  idUsuario: number;
  idFilme: number;
  nota: number;
  comentario: string | null;
  data_avaliacao: Date;
};

function mapStoredReview(review: AvaliacaoRaw): StoredReview {
  return {
    id: review.idAvaliacao,
    idUsuario: review.idUsuario,
    idFilme: review.idFilme,
    nota: Number(review.nota),
    comentario: review.comentario,
    createdAt: review.data_avaliacao,
  };
}

export class PrismaCatalogRepository implements CatalogRepository {
  constructor(private prisma: PrismaClient = createPrismaClient()) {}

  async findCatalogMovies(): Promise<FilmeCatalogo[]> {
    const [filmes, stats] = await Promise.all([
      this.prisma.filme.findMany(),
      this.getStatsByMovie(),
    ]);

    return filmes.map((filme: FilmeRaw) => this.toDomain(filme, stats.get(filme.idFilme) ?? distribuicaoVazia()));
  }

  async findCatalogMovieById(idFilme: number): Promise<FilmeCatalogo | null> {
    const [filme, stats] = await Promise.all([
      this.prisma.filme.findUnique({ where: { idFilme } }),
      this.getStatsByMovie(idFilme),
    ]);

    if (!filme) return null;

    return this.toDomain(filme, stats.get(idFilme) ?? distribuicaoVazia());
  }

  async getUserWatchedTickets(idUsuario: number, idFilme: number): Promise<Array<{ dataSessao: Date }>> {
    const ingressos = await this.prisma.ingresso.findMany({
      where: {
        idUsuario,
        sessao: {
          idFilme,
          dataHora: { lte: new Date() },
        },
      },
      select: {
        sessao: {
          select: {
            dataHora: true,
          },
        },
      },
    });

    return ingressos.map((ingresso: { sessao: { dataHora: Date } }) => ({
      dataSessao: ingresso.sessao.dataHora,
    }));
  }

  async findReviewByUserAndMovie(idUsuario: number, idFilme: number): Promise<StoredReview | null> {
    const review = await this.prisma.avaliacao.findUnique({
      where: {
        idUsuario_idFilme: {
          idUsuario,
          idFilme,
        },
      },
    });

    if (!review) return null;
    return mapStoredReview(review);
  }

  async findReviewById(idAvaliacao: number): Promise<StoredReview | null> {
    const review = await this.prisma.avaliacao.findUnique({
      where: { idAvaliacao },
    });

    if (!review) return null;
    return mapStoredReview(review);
  }

  async listReviewsByMovie(idFilme: number, page: number, pageSize: number): Promise<{ data: ReviewListItem[]; total: number }> {
    const skip = (page - 1) * pageSize;

    const [reviews, total] = await Promise.all([
      this.prisma.avaliacao.findMany({
        where: { idFilme },
        include: {
          usuario: {
            select: {
              nome: true,
            },
          },
        },
        orderBy: {
          data_avaliacao: "desc",
        },
        skip,
        take: pageSize,
      }),
      this.prisma.avaliacao.count({ where: { idFilme } }),
    ]);

    return {
      data: reviews.map((review: AvaliacaoRaw & { usuario: { nome: string | null } }) => ({
        id: review.idAvaliacao,
        usuario: {
          nome: review.usuario.nome,
        },
        nota: Number(review.nota),
        comentario: review.comentario,
        createdAt: review.data_avaliacao,
      })),
      total,
    };
  }

  async createReview(data: { idUsuario: number; idFilme: number; nota: number; comentario: string | null }): Promise<StoredReview> {
    const created = await this.prisma.avaliacao.create({
      data: {
        idUsuario: data.idUsuario,
        idFilme: data.idFilme,
        nota: data.nota,
        comentario: data.comentario ?? "",
        data_avaliacao: new Date(),
      },
    });

    return mapStoredReview(created);
  }

  async updateReview(idAvaliacao: number, data: { nota: number; comentario: string | null }): Promise<StoredReview> {
    const updated = await this.prisma.avaliacao.update({
      where: { idAvaliacao },
      data: {
        nota: data.nota,
        comentario: data.comentario ?? "",
        data_avaliacao: new Date(),
      },
    });

    return mapStoredReview(updated);
  }

  async deleteReview(idAvaliacao: number): Promise<void> {
    await this.prisma.avaliacao.delete({ where: { idAvaliacao } });
  }

  private async getStatsByMovie(idFilme?: number): Promise<Map<number, DistribuicaoAvaliacoes>> {
    const groupByArgs: {
      by: ["idFilme", "nota"];
      where?: { idFilme: number };
      _count: { _all: true };
    } = {
      by: ["idFilme", "nota"],
      _count: { _all: true },
    };

    if (idFilme !== undefined) groupByArgs.where = { idFilme };

    const grouped = await this.prisma.avaliacao.groupBy(groupByArgs);

    const map = new Map<number, DistribuicaoAvaliacoes>();

    for (const item of grouped) {
      const nota = Number(item.nota);
      if (!Number.isInteger(nota) || nota < 1 || nota > 5) continue;

      const distribuicao = map.get(item.idFilme) ?? distribuicaoVazia();
      distribuicao[nota as 1 | 2 | 3 | 4 | 5] = item._count._all;
      map.set(item.idFilme, distribuicao);
    }

    return map;
  }

  private toDomain(filme: FilmeRaw, distribuicao: DistribuicaoAvaliacoes): FilmeCatalogo {
    return new FilmeCatalogo(
      filme.idFilme,
      filme.titulo,
      filme.dataLancamento.getFullYear(),
      filme.duracao,
      filme.classificacaoIndicativa,
      filme.genero,
      filme.sinopse,
      filme.poster,
      filme.dataLancamento,
      filme.dataFimCartaz,
      new EstatisticaAvaliacoes(distribuicao),
    );
  }
}
