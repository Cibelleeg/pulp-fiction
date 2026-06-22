import type { FilmeCatalogo } from "../../domain/catalog/CatalogMovie.js";
import type { CatalogMovieListItem } from "./CatalogRepository.js";

export function roundRating(value: number): number {
  return Number(value.toFixed(2));
}

export function toCatalogListItem(
  filme: FilmeCatalogo,
  rank: number,
  mediaGlobal: number,
  minimoAvaliacoes: number,
): CatalogMovieListItem {
  return {
    id: filme.id,
    rank,
    titulo: filme.titulo,
    ano: filme.ano,
    sinopse: filme.sinopse,
    duracao: filme.duracao,
    classificacao: filme.classificacao,
    genero: filme.genero,
    dataLancamento: filme.dataLancamento,
    dataFimCartaz: filme.dataFimCartaz,
    posterUrl: filme.posterUrl,
    estado: filme.estado(),
    generos: filme.generos(),
    media: roundRating(filme.media()),
    notaPonderada: roundRating(filme.notaPonderada(mediaGlobal, minimoAvaliacoes)),
    totalAvaliacoes: filme.totalAvaliacoes(),
  };
}
