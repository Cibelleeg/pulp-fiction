import type { Sessao } from "../../domain/session/Session.js";
import type { CreateSessionInput, SessionRepository } from "./SessionRepository.js";

export class CreateSessionUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(data: CreateSessionInput): Promise<Sessao> {
    return await this.sessionRepository.create(data);
  }
}
