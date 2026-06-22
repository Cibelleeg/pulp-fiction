import type { CatalogRepository } from "./CatalogRepository.js";
import { ReviewForbiddenError, ReviewNotFoundError } from "./UpdateReviewUseCase.js";

export class DeleteReviewUseCase {
  constructor(private catalogRepository: CatalogRepository) {}

  async execute(idAvaliacao: number, idUsuario: number): Promise<void> {
    const existing = await this.catalogRepository.findReviewById(idAvaliacao);
    if (!existing) throw new ReviewNotFoundError();
    if (existing.idUsuario !== idUsuario) throw new ReviewForbiddenError();

    await this.catalogRepository.deleteReview(idAvaliacao);
  }
}
