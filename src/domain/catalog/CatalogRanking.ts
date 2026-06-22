import type { FilmeCatalogo } from "./CatalogMovie.js";

export class RankingCatalogo {
  constructor(private readonly minimoAvaliacoes: number) {}

  ordenar(filmes: FilmeCatalogo[]): FilmeCatalogo[] {
    const mediaGlobal = this.mediaGlobal(filmes);

    return [...filmes].sort((a, b) => {
      const notaB = b.notaPonderada(mediaGlobal, this.minimoAvaliacoes);
      const notaA = a.notaPonderada(mediaGlobal, this.minimoAvaliacoes);
      if (notaB !== notaA) return notaB - notaA;
      return b.totalAvaliacoes() - a.totalAvaliacoes();
    });
  }

  mediaGlobal(filmes: FilmeCatalogo[]): number {
    let soma = 0;
    let total = 0;

    for (const filme of filmes) {
      soma += filme.media() * filme.totalAvaliacoes();
      total += filme.totalAvaliacoes();
    }

    return total === 0 ? 0 : soma / total;
  }
}
