import { Avaliacao } from "../../domain/catalog/Review.js";
import type { CatalogRepository, StoredReview } from "./CatalogRepository.js";

export class ReviewNotFoundError extends Error {
  constructor() {
    super("Avaliação não encontrada.");
    this.name = "ReviewNotFoundError";
  }
}

export class ReviewForbiddenError extends Error {
  constructor() {
    super("Você só pode alterar a sua própria avaliação.");
    this.name = "ReviewForbiddenError";
  }
}

export class UpdateReviewUseCase {
  constructor(private catalogRepository: CatalogRepository) {}

  async execute(
    idAvaliacao: number,
    idUsuario: number,
    data: { nota: number; comentario?: string | null },
  ): Promise<StoredReview> {
    const existing = await this.catalogRepository.findReviewById(idAvaliacao);
    if (!existing) throw new ReviewNotFoundError();
    if (existing.idUsuario !== idUsuario) throw new ReviewForbiddenError();

    const avaliacao = Avaliacao.atualizar({
      idUsuario,
      idFilme: existing.idFilme,
      nota: data.nota,
      comentario: data.comentario ?? null,
    });

    return await this.catalogRepository.updateReview(idAvaliacao, {
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
    });
  }
}
