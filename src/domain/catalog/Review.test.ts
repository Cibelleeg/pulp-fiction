import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Avaliacao, AvaliacaoNaoElegivelError, NotaInvalidaError } from "./Review.js";

describe("Avaliacao", () => {
  it("cria avaliacao elegivel com nota valida", () => {
    const avaliacao = Avaliacao.criar({
      idUsuario: 1,
      idFilme: 2,
      nota: 5,
      comentario: "Excelente",
      elegivel: true,
    });

    assert.equal(avaliacao.nota, 5);
    assert.equal(avaliacao.comentario, "Excelente");
  });

  it("bloqueia nota fora de 1 a 5", () => {
    assert.throws(
      () => Avaliacao.criar({ idUsuario: 1, idFilme: 2, nota: 6, elegivel: true }),
      NotaInvalidaError
    );
  });

  it("bloqueia usuario nao elegivel", () => {
    assert.throws(
      () => Avaliacao.criar({ idUsuario: 1, idFilme: 2, nota: 5, elegivel: false }),
      AvaliacaoNaoElegivelError
    );
  });
});
