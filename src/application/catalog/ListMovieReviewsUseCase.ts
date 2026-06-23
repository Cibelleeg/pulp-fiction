import type { CatalogRepository, ReviewListItem, UserReviewListItem } from "./CatalogRepository.js";

export type ListMovieReviewsOutput = {
  data: ReviewListItem[];
  page: number;
  pageSize: number;
  total: number;
};

export class ListMovieReviewsUseCase {
  constructor(private catalogRepository: CatalogRepository) {}

  async execute(idFilme: number, page: number, pageSize: number): Promise<ListMovieReviewsOutput> {
    const reviews = await this.catalogRepository.listReviewsByMovie(idFilme, page, pageSize);

    return {
      ...reviews,
      page,
      pageSize,
    };
  }
}

export class ListUserReviewsUseCase {
  constructor(private catalogRepository: CatalogRepository) {}

  async execute(idUsuario: number): Promise<UserReviewListItem[]> {
    return this.catalogRepository.listReviewsByUser(idUsuario);
  }
}
