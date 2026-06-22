import type { FilmeCatalogo, EstadoFilme } from "../../domain/catalog/CatalogMovie.js";
import type { DistribuicaoAvaliacoes } from "../../domain/catalog/ReviewStats.js";

export type CatalogSort = "nota" | "recentes" | "avaliados";

export type CatalogFilters = {
  genero?: string;
  ano?: number;
  estado?: EstadoFilme;
};

export type CatalogListParams = CatalogFilters & {
  ordenar: CatalogSort;
  page: number;
  pageSize: number;
};

export type CatalogMovieListItem = {
  id: number;
  rank: number;
  titulo: string;
  ano: number;
  sinopse: string;
  duracao: number;
  classificacao: number;
  genero: string;
  dataLancamento: Date;
  dataFimCartaz: Date | null;
  posterUrl: string | null;
  estado: EstadoFilme;
  generos: string[];
  media: number;
  notaPonderada: number;
  totalAvaliacoes: number;
};

export type CatalogMovieDetail = CatalogMovieListItem & {
  sinopse: string;
  duracao: number;
  classificacao: number;
  distribuicao: DistribuicaoAvaliacoes;
  elegibilidade?: ElegibilidadeUsuario | null;
};

export type ElegibilidadeUsuario = {
  podeAvaliar: boolean;
  jaAvaliou: boolean;
  motivo: "NAO_ASSISTIU" | "EM_BREVE" | null;
  minhaAvaliacao: MinhaAvaliacao | null;
};

export type MinhaAvaliacao = {
  id: number;
  nota: number;
  comentario: string | null;
  createdAt: Date;
};

export type ReviewListItem = {
  id: number;
  usuario: {
    nome: string | null;
  };
  nota: number;
  comentario: string | null;
  createdAt: Date;
};

export type StoredReview = {
  id: number;
  idUsuario: number;
  idFilme: number;
  nota: number;
  comentario: string | null;
  createdAt: Date;
};

export interface CatalogRepository {
  findCatalogMovies(): Promise<FilmeCatalogo[]>;
  findCatalogMovieById(idFilme: number): Promise<FilmeCatalogo | null>;
  getUserWatchedTickets(idUsuario: number, idFilme: number): Promise<Array<{ dataSessao: Date }>>;
  findReviewByUserAndMovie(idUsuario: number, idFilme: number): Promise<StoredReview | null>;
  findReviewById(idAvaliacao: number): Promise<StoredReview | null>;
  listReviewsByMovie(idFilme: number, page: number, pageSize: number): Promise<{ data: ReviewListItem[]; total: number }>;
  createReview(data: { idUsuario: number; idFilme: number; nota: number; comentario: string | null }): Promise<StoredReview>;
  updateReview(idAvaliacao: number, data: { nota: number; comentario: string | null }): Promise<StoredReview>;
  deleteReview(idAvaliacao: number): Promise<void>;
}
