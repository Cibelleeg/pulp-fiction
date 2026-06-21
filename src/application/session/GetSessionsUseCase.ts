import type { Sessao } from "../../domain/session/Session.js";
import type { SessionRepository } from "./SessionRepository.js";

export class GetSessionsUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(): Promise<Sessao[]> {
    return await this.sessionRepository.findAll();
  }
}

export class GetSessionByIdUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(id: number): Promise<Sessao | null> {
    return await this.sessionRepository.findById(id);
  }
}
