import type { SessionRepository } from "./SessionRepository.js";

export class DeleteSessionUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(id: number): Promise<void> {
    const session = await this.sessionRepository.findById(id);
    if (!session) {
      throw new Error("Session not found");
    }

    await this.sessionRepository.deleteById(id);
  }
}
