import { RankingCatalogo } from "../../domain/catalog/CatalogRanking.js";
import { PoliticaDeElegibilidade } from "../../domain/catalog/EligibilityPolicy.js";
import type { CatalogMovieDetail, CatalogRepository, ElegibilidadeUsuario } from "./CatalogRepository.js";
import { toCatalogListItem } from "./CatalogPresenters.js";

export class GetCatalogMovieDetailUseCase {
  constructor(
    private catalogRepository: CatalogRepository,
    private minimoAvaliacoesRanking: number,
  ) {}

  async execute(idFilme: number, idUsuario?: number): Promise<CatalogMovieDetail | null> {
    const [filmes, filme] = await Promise.all([
      this.catalogRepository.findCatalogMovies(),
      this.catalogRepository.findCatalogMovieById(idFilme),
    ]);

    if (!filme) return null;

    const ranking = new RankingCatalogo(this.minimoAvaliacoesRanking);
    const ordenados = ranking.ordenar(filmes);
    const mediaGlobal = ranking.mediaGlobal(filmes);
    const rank = ordenados.findIndex((item) => item.id === filme.id) + 1;

    return {
      ...toCatalogListItem(filme, rank || 1, mediaGlobal, this.minimoAvaliacoesRanking),
      sinopse: filme.sinopse,
      duracao: filme.duracao,
      classificacao: filme.classificacao,
      distribuicao: filme.distribuicao(),
      elegibilidade: idUsuario ? await this.getElegibilidade(idUsuario, idFilme, filme.estado()) : null,
    };
  }

  private async getElegibilidade(
    idUsuario: number,
    idFilme: number,
    estado: string,
  ): Promise<ElegibilidadeUsuario> {
    const review = await this.catalogRepository.findReviewByUserAndMovie(idUsuario, idFilme);

    if (review) {
      return {
        podeAvaliar: false,
        jaAvaliou: true,
        motivo: null,
        minhaAvaliacao: {
          id: review.id,
          nota: review.nota,
          comentario: review.comentario,
          createdAt: review.createdAt,
        },
      };
    }

    if (estado === "breve") {
      return { podeAvaliar: false, jaAvaliou: false, motivo: "EM_BREVE", minhaAvaliacao: null };
    }

    const ingressos = await this.catalogRepository.getUserWatchedTickets(idUsuario, idFilme);
    const podeAvaliar = new PoliticaDeElegibilidade().podeAvaliar(ingressos);

    return {
      podeAvaliar,
      jaAvaliou: false,
      motivo: podeAvaliar ? null : "NAO_ASSISTIU",
      minhaAvaliacao: null,
    };
  }
}
