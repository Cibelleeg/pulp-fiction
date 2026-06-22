export class NotaInvalidaError extends Error {
  constructor() {
    super("A nota deve ser um inteiro de 1 a 5.");
    this.name = "NotaInvalidaError";
  }
}

export class AvaliacaoNaoElegivelError extends Error {
  constructor() {
    super("Você precisa ter assistido a este filme na CINEFESP para avaliá-lo.");
    this.name = "AvaliacaoNaoElegivelError";
  }
}

export class Avaliacao {
  private constructor(
    public readonly idUsuario: number,
    public readonly idFilme: number,
    public readonly nota: number,
    public readonly comentario: string | null,
  ) {
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
      throw new NotaInvalidaError();
    }
  }

  static criar(params: {
    idUsuario: number;
    idFilme: number;
    nota: number;
    comentario?: string | null;
    elegivel: boolean;
  }): Avaliacao {
    if (!params.elegivel) {
      throw new AvaliacaoNaoElegivelError();
    }

    return new Avaliacao(
      params.idUsuario,
      params.idFilme,
      params.nota,
      params.comentario ?? null,
    );
  }

  static atualizar(params: {
    idUsuario: number;
    idFilme: number;
    nota: number;
    comentario?: string | null;
  }): Avaliacao {
    return new Avaliacao(
      params.idUsuario,
      params.idFilme,
      params.nota,
      params.comentario ?? null,
    );
  }
}
