import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Usuario } from "./User.js";

describe("Usuario", () => {
  it("calcula idade antes e depois do aniversario", () => {
    const usuario = new Usuario(
      1,
      "Ada",
      "ada@example.com",
      "00000000000",
      "11999999999",
      new Date("2000-06-24T00:00:00Z"),
      "USER"
    );

    assert.equal(usuario.idadeEm(new Date("2026-06-23T00:00:00Z")), 25);
    assert.equal(usuario.idadeEm(new Date("2026-06-24T00:00:00Z")), 26);
  });
});
