import type { Sessao } from "../../domain/session/Session.js";
import type { SessionRepository, UpdateSessionInput } from "./SessionRepository.js";

export class UpdateSessionUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(id: number, data: UpdateSessionInput): Promise<Sessao> {
    const session = await this.sessionRepository.findById(id);
    if (!session) {
      throw new Error("Session not found");
    }

    return await this.sessionRepository.updateById(id, data);
  }
}
