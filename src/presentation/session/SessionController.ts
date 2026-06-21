import type { CreateSessionUseCase } from "../../application/session/CreateSessionUseCase.js";
import type { DeleteSessionUseCase } from "../../application/session/DeleteSessionUseCase.js";
import type { GetSessionByIdUseCase, GetSessionsUseCase } from "../../application/session/GetSessionsUseCase.js";
import type { UpdateSessionUseCase } from "../../application/session/UpdateSessionUseCase.js";
import type { Request, Response } from "express";

export class SessionController {
  constructor(
    private createSessionUseCase: CreateSessionUseCase,
    private getSessionsUseCase: GetSessionsUseCase,
    private getSessionByIdUseCase: GetSessionByIdUseCase,
    private updateSessionUseCase: UpdateSessionUseCase,
    private deleteSessionUseCase: DeleteSessionUseCase
  ) {}

  async createSession(req: Request, res: Response): Promise<void> {
    try {
      const { movieId, roomId, dateTime, language, format, basePrice } = req.body;

      if (!movieId || !roomId || !dateTime || !language || !format || basePrice === undefined) {
        res.status(400).json({ error: "Missing required fields." });
        return;
      }

      const parsedDateTime = new Date(dateTime);
      if (isNaN(parsedDateTime.getTime())) {
        res.status(400).json({ error: "Invalid dateTime." });
        return;
      }

      const createdSession = await this.createSessionUseCase.execute({
        movieId: Number(movieId),
        roomId: Number(roomId),
        dateTime: parsedDateTime,
        language,
        format,
        basePrice: Number(basePrice),
      });

      res.status(201).json(createdSession);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getSessions(_req: Request, res: Response): Promise<void> {
    try {
      const sessions = await this.getSessionsUseCase.execute();
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async getSessionById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }

      const session = await this.getSessionByIdUseCase.execute(id);
      if (!session) {
        res.status(404).json({ error: "Session not found." });
        return;
      }

      res.status(200).json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async updateSession(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }

      const { movieId, roomId, dateTime, language, format, basePrice } = req.body;
      const data: {
        movieId?: number;
        roomId?: number;
        dateTime?: Date;
        language?: string;
        format?: string;
        basePrice?: number;
      } = {};

      if (movieId !== undefined) data.movieId = Number(movieId);
      if (roomId !== undefined) data.roomId = Number(roomId);
      if (language !== undefined) data.language = language;
      if (format !== undefined) data.format = format;
      if (basePrice !== undefined) data.basePrice = Number(basePrice);
      if (dateTime !== undefined) {
        const parsedDateTime = new Date(dateTime);
        if (isNaN(parsedDateTime.getTime())) {
          res.status(400).json({ error: "Invalid dateTime." });
          return;
        }
        data.dateTime = parsedDateTime;
      }

      const updatedSession = await this.updateSessionUseCase.execute(id, data);
      res.status(200).json(updatedSession);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async deleteSession(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID." });
        return;
      }

      await this.deleteSessionUseCase.execute(id);
      res.status(204).json({ message: "Session deleted successfully." });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
}
