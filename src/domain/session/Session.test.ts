import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DomainError } from "../error/DomainError.js";
import { Sessao } from "./Session.js";
import { TypeIngresso } from "../ticketType/TicketType.js";

function sessao(overrides: { dateTime?: Date } = {}): Sessao {
  const values: ConstructorParameters<typeof Sessao> = [
    1,
    10,
    20,
    30,
    overrides.dateTime ?? new Date("2099-01-01T20:00:00Z"),
    "Dublado",
    "2D",
    40,
    "Sala 1",
    "IMAX",
    100,
    100,
  ];

  return new Sessao(...values);
}

describe("Sessao", () => {
  it("calcula meia-entrada como metade do preco base", () => {
    assert.equal(sessao().calcularPreco(TypeIngresso.MEIA, 0), 20);
  });

  it("bloqueia meia-entrada quando o limite de 40% foi atingido", () => {
    assert.throws(
      () => sessao().calcularPreco(TypeIngresso.MEIA, 40),
      DomainError
    );
  });

  it("identifica sessao encerrada pela data", () => {
    const encerrada = sessao({ dateTime: new Date("2020-01-01T20:00:00Z") });
    assert.equal(encerrada.estaAberta(new Date("2020-01-02T20:00:00Z")), false);
  });
});
