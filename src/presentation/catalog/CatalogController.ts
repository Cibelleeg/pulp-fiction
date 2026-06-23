import type { Request, Response } from "express";
import { AvaliacaoNaoElegivelError, DuplicateReviewError } from "../../application/catalog/CreateMovieReviewUseCase.js";
import type { CreateMovieReviewUseCase } from "../../application/catalog/CreateMovieReviewUseCase.js";
import type { DeleteReviewUseCase } from "../../application/catalog/DeleteReviewUseCase.js";
import type { GetCatalogMovieDetailUseCase } from "../../application/catalog/GetCatalogMovieDetailUseCase.js";
import type { ListCatalogMoviesUseCase } from "../../application/catalog/ListCatalogMoviesUseCase.js";
import type { ListMovieReviewsUseCase, ListUserReviewsUseCase } from "../../application/catalog/ListMovieReviewsUseCase.js";
import { ReviewForbiddenError, ReviewNotFoundError } from "../../application/catalog/UpdateReviewUseCase.js";
import type { UpdateReviewUseCase } from "../../application/catalog/UpdateReviewUseCase.js";
import { NotaInvalidaError } from "../../domain/catalog/Review.js";
import type { DeleteMovieUseCase } from "../../application/catalog/DeleteMovieUseCase.js";
import type { CreateMovieUseCase } from "../../application/catalog/CreateMovieUseCase.js";
import type { UpdateMovieUseCase } from "../../application/catalog/UpdateMovieUseCase.js";

export class CatalogController {
  constructor(
    private listCatalogMoviesUseCase: ListCatalogMoviesUseCase,
    private getCatalogMovieDetailUseCase: GetCatalogMovieDetailUseCase,
    private listMovieReviewsUseCase: ListMovieReviewsUseCase,
    private listUserReviewsUseCase: ListUserReviewsUseCase,
    private createMovieReviewUseCase: CreateMovieReviewUseCase,
    private updateReviewUseCase: UpdateReviewUseCase,
    private deleteReviewUseCase: DeleteReviewUseCase,
    private createMovieUseCase: CreateMovieUseCase,
    private updateMovieUseCase: UpdateMovieUseCase,
    private deleteMovieUseCase: DeleteMovieUseCase,
  ) {}

  async listMovies(req: Request, res: Response): Promise<void> {
    try {
      const page = this.positiveInt(req.query.page, 1);
      const pageSize = Math.min(this.positiveInt(req.query.pageSize, 24), 100);
      const ano = req.query.ano !== undefined ? Number(req.query.ano) : undefined;
      const ordenar = String(req.query.ordenar ?? "nota");
      const estado = req.query.estado !== undefined ? String(req.query.estado) : undefined;

      if (!["nota", "recentes", "avaliados"].includes(ordenar)) {
        res.status(400).json({ error: "Invalid sort." });
        return;
      }
      if (estado !== undefined && !["cartaz", "breve", "encerrado"].includes(estado)) {
        res.status(400).json({ error: "Invalid movie state." });
        return;
      }
      if (ano !== undefined && (!Number.isInteger(ano) || ano <= 0)) {
        res.status(400).json({ error: "Invalid year." });
        return;
      }

      const params: {
        ordenar: "nota" | "recentes" | "avaliados";
        page: number;
        pageSize: number;
        genero?: string;
        ano?: number;
        estado?: "cartaz" | "breve" | "encerrado";
      } = {
        ordenar: ordenar as "nota" | "recentes" | "avaliados",
        page,
        pageSize,
      };

      if (req.query.genero !== undefined) params.genero = String(req.query.genero);
      if (ano !== undefined) params.ano = ano;
      if (estado !== undefined) params.estado = estado as "cartaz" | "breve" | "encerrado";

      const result = await this.listCatalogMoviesUseCase.execute(params);

      res.status(200).json(result);
    } catch {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async getMovieDetail(req: Request, res: Response): Promise<void> {
    try {
      const idFilme = Number(req.params.id);
      if (!Number.isInteger(idFilme) || idFilme <= 0) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }

      const result = await this.getCatalogMovieDetailUseCase.execute(idFilme, req.user?.id);
      if (!result) {
        res.status(404).json({ error: "Filme not found." });
        return;
      }

      res.status(200).json(result);
    } catch {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async listMovieReviews(req: Request, res: Response): Promise<void> {
    try {
      const idFilme = Number(req.params.id);
      if (!Number.isInteger(idFilme) || idFilme <= 0) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }

      const page = this.positiveInt(req.query.page, 1);
      const pageSize = Math.min(this.positiveInt(req.query.pageSize, 10), 50);
      const result = await this.listMovieReviewsUseCase.execute(idFilme, page, pageSize);

      res.status(200).json(result);
    } catch {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async listUserReviews(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized." });
        return;
      }

      const result = await this.listUserReviewsUseCase.execute(req.user.id);
      res.status(200).json(result);
    } catch {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async createMovieReview(req: Request, res: Response): Promise<void> {
    try {
      const idFilme = Number(req.params.id);
      if (!Number.isInteger(idFilme) || idFilme <= 0) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized." });
        return;
      }

      const result = await this.createMovieReviewUseCase.execute({
        idUsuario: req.user.id,
        idFilme,
        nota: Number(req.body.nota),
        comentario: req.body.comentario ?? null,
      });

      res.status(201).json(result);
    } catch (error) {
      this.handleReviewError(error, res);
    }
  }

  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const idAvaliacao = Number(req.params.id);
      if (!Number.isInteger(idAvaliacao) || idAvaliacao <= 0) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized." });
        return;
      }

      const result = await this.updateReviewUseCase.execute(idAvaliacao, req.user.id, {
        nota: Number(req.body.nota),
        comentario: req.body.comentario ?? null,
      });

      res.status(200).json(result);
    } catch (error) {
      this.handleReviewError(error, res);
    }
  }

  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const idAvaliacao = Number(req.params.id);
      if (!Number.isInteger(idAvaliacao) || idAvaliacao <= 0) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized." });
        return;
      }

      await this.deleteReviewUseCase.execute(idAvaliacao, req.user.id);
      res.status(204).send();
    } catch (error) {
      this.handleReviewError(error, res);
    }
  }

  private positiveInt(value: unknown, fallback: number): number {
    const parsed = Number(value ?? fallback);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }

  private handleReviewError(error: unknown, res: Response): void {
    if (error instanceof NotaInvalidaError) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (error instanceof AvaliacaoNaoElegivelError) {
      res.status(403).json({ erro: "NAO_ELEGIVEL", mensagem: error.message });
      return;
    }
    if (error instanceof DuplicateReviewError) {
      res.status(409).json({ erro: "AVALIACAO_DUPLICADA" });
      return;
    }
    if (error instanceof ReviewForbiddenError) {
      res.status(403).json({ error: error.message });
      return;
    }
    if (error instanceof ReviewNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal Server Error." });
  }

  async createMovie(req: Request, res: Response): Promise<void> {
    try {
      const { title, synopsis, duration, ageRating, genre, year, releaseDate, endDate, posterUrl } = req.body;

      if (!title || !synopsis || !duration || !ageRating || !genre || !year || !releaseDate) {
        res.status(400).json({ error: "Campos obrigatórios faltando." });
        return;
      }

      const durationNum = Number(duration);
      if (!Number.isInteger(durationNum) || durationNum <= 0) {
        res.status(400).json({ error: "Duração inválida." });
        return;
      }

      const createdMovie = await this.createMovieUseCase.execute({
        titulo: title,
        ano: Number(year),
        duracao: durationNum,
        classificacao: Number(ageRating),
        genero: genre,
        sinopse: synopsis,
        posterUrl: posterUrl ?? null,
        dataLancamento: new Date(releaseDate),
        dataFimCartaz: endDate ? new Date(endDate) : null,
      });

      res.status(201).json(createdMovie);
    } catch {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async updateMovie(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: "ID inválido." });
        return;
      }
      const updatedMovie = await this.updateMovieUseCase.execute(id, req.body);
      res.status(200).json(updatedMovie);
    } catch (error) {
      if (error instanceof Error && error.message === "Movie not found.") {
        res.status(404).json({ error: "Movie not found." });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async deleteMovie(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: "ID inválido." });
        return;
      }
      await this.deleteMovieUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "Movie not found.") {
        res.status(404).json({ error: "Movie not found." });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
}
