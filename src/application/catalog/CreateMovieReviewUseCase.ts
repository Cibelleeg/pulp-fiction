import { Avaliacao, AvaliacaoNaoElegivelError } from "../../domain/catalog/Review.js";
import { PoliticaDeElegibilidade } from "../../domain/catalog/EligibilityPolicy.js";
import type { CatalogRepository, StoredReview } from "./CatalogRepository.js";

export class DuplicateReviewError extends Error {
  constructor() {
    super("Este filme já foi avaliado por este usuário.");
    this.name = "DuplicateReviewError";
  }
}

export class CreateMovieReviewUseCase {
  constructor(private catalogRepository: CatalogRepository) {}

  async execute(data: {
    idUsuario: number;
    idFilme: number;
    nota: number;
    comentario?: string | null;
  }): Promise<StoredReview> {
    const existing = await this.catalogRepository.findReviewByUserAndMovie(data.idUsuario, data.idFilme);
    if (existing) throw new DuplicateReviewError();

    const ingressos = await this.catalogRepository.getUserWatchedTickets(data.idUsuario, data.idFilme);
    const elegivel = new PoliticaDeElegibilidade().podeAvaliar(ingressos);

    const avaliacao = Avaliacao.criar({
      idUsuario: data.idUsuario,
      idFilme: data.idFilme,
      nota: data.nota,
      comentario: data.comentario ?? null,
      elegivel,
    });

    try {
      return await this.catalogRepository.createReview({
        idUsuario: avaliacao.idUsuario,
        idFilme: avaliacao.idFilme,
        nota: avaliacao.nota,
        comentario: avaliacao.comentario,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Unique constraint")) {
        throw new DuplicateReviewError();
      }
      throw error;
    }
  }
}

export { AvaliacaoNaoElegivelError };
