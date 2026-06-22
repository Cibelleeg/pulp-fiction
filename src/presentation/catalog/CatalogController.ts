import type { Request, Response } from "express";
import { AvaliacaoNaoElegivelError, DuplicateReviewError } from "../../application/catalog/CreateMovieReviewUseCase.js";
import type { CreateMovieReviewUseCase } from "../../application/catalog/CreateMovieReviewUseCase.js";
import type { DeleteReviewUseCase } from "../../application/catalog/DeleteReviewUseCase.js";
import type { GetCatalogMovieDetailUseCase } from "../../application/catalog/GetCatalogMovieDetailUseCase.js";
import type { ListCatalogMoviesUseCase } from "../../application/catalog/ListCatalogMoviesUseCase.js";
import type { ListMovieReviewsUseCase } from "../../application/catalog/ListMovieReviewsUseCase.js";
import { ReviewForbiddenError, ReviewNotFoundError } from "../../application/catalog/UpdateReviewUseCase.js";
import type { UpdateReviewUseCase } from "../../application/catalog/UpdateReviewUseCase.js";
import { NotaInvalidaError } from "../../domain/catalog/Review.js";

export class CatalogController {
  constructor(
    private listCatalogMoviesUseCase: ListCatalogMoviesUseCase,
    private getCatalogMovieDetailUseCase: GetCatalogMovieDetailUseCase,
    private listMovieReviewsUseCase: ListMovieReviewsUseCase,
    private createMovieReviewUseCase: CreateMovieReviewUseCase,
    private updateReviewUseCase: UpdateReviewUseCase,
    private deleteReviewUseCase: DeleteReviewUseCase,
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
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async getMovieDetail(req: Request, res: Response): Promise<void> {
    try {
      const idFilme = Number(req.params.id);
      if (!Number.isInteger(idFilme)) {
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
      if (!Number.isInteger(idFilme)) {
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

  async createMovieReview(req: Request, res: Response): Promise<void> {
    try {
      const idFilme = Number(req.params.id);
      if (!Number.isInteger(idFilme) || !req.user) {
        res.status(400).json({ error: "Invalid request." });
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
      if (!Number.isInteger(idAvaliacao) || !req.user) {
        res.status(400).json({ error: "Invalid request." });
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
      if (!Number.isInteger(idAvaliacao) || !req.user) {
        res.status(400).json({ error: "Invalid request." });
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
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: "Internal Server Error." });
  }
}
