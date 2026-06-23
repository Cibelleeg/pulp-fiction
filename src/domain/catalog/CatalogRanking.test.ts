import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FilmeCatalogo } from "./CatalogMovie.js";
import { RankingCatalogo } from "./CatalogRanking.js";
import { EstatisticaAvaliacoes } from "./ReviewStats.js";

function filme(id: number, distribuicao: Record<1 | 2 | 3 | 4 | 5, number>): FilmeCatalogo {
  return new FilmeCatalogo(
    id,
    `Filme ${id}`,
    2026,
    120,
    12,
    "Drama",
    "Sinopse",
    null,
    new Date("2026-01-01T00:00:00Z"),
    null,
    new EstatisticaAvaliacoes(distribuicao)
  );
}

describe("RankingCatalogo", () => {
  it("desempata por total de avaliacoes quando a nota ponderada empata", () => {
    const poucoAvaliado = filme(1, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2 });
    const muitoAvaliado = filme(2, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 10 });

    const [primeiro] = new RankingCatalogo(5).ordenar([poucoAvaliado, muitoAvaliado]);

    assert.ok(primeiro);
    assert.equal(primeiro.id, 2);
  });
});
