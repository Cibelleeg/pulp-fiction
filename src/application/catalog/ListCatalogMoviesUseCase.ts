import { RankingCatalogo } from "../../domain/catalog/CatalogRanking.js";
import type { FilmeCatalogo } from "../../domain/catalog/CatalogMovie.js";
import type { CatalogListParams, CatalogMovieListItem, CatalogRepository } from "./CatalogRepository.js";
import { toCatalogListItem } from "./CatalogPresenters.js";

export type ListCatalogMoviesOutput = {
  data: CatalogMovieListItem[];
  page: number;
  pageSize: number;
  total: number;
};

export class ListCatalogMoviesUseCase {
  constructor(
    private catalogRepository: CatalogRepository,
    private minimoAvaliacoesRanking: number,
  ) {}

  async execute(params: CatalogListParams): Promise<ListCatalogMoviesOutput> {
    const ranking = new RankingCatalogo(this.minimoAvaliacoesRanking);
    const filmes = await this.catalogRepository.findCatalogMovies();
    const filtrados = this.filter(filmes, params);
    const mediaGlobal = ranking.mediaGlobal(filtrados);

    let ordenados: FilmeCatalogo[];
    if (params.ordenar === "recentes") {
      ordenados = [...filtrados].sort((a, b) => b.dataLancamento.getTime() - a.dataLancamento.getTime());
    } else if (params.ordenar === "avaliados") {
      ordenados = [...filtrados].sort((a, b) => b.totalAvaliacoes() - a.totalAvaliacoes());
    } else {
      ordenados = ranking.ordenar(filtrados);
    }

    const ranked = ordenados.map((filme, index) =>
      toCatalogListItem(filme, index + 1, mediaGlobal, this.minimoAvaliacoesRanking),
    );

    const start = (params.page - 1) * params.pageSize;

    return {
      data: ranked.slice(start, start + params.pageSize),
      page: params.page,
      pageSize: params.pageSize,
      total: ranked.length,
    };
  }

  private filter(filmes: FilmeCatalogo[], params: CatalogListParams): FilmeCatalogo[] {
    return filmes.filter((filme) => {
      if (params.genero && filme.genero !== params.genero) return false;
      if (params.ano && filme.ano !== params.ano) return false;
      if (params.estado && filme.estado() !== params.estado) return false;
      return true;
    });
  }
}
