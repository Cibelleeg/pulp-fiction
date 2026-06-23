import type { SalaRepository } from "./SalaRepository.js";

export class DeleteSalaUseCase {
  constructor(private salaRepository: SalaRepository) {}

  async execute(id: number): Promise<void> {
    return this.salaRepository.deleteById(id);
  }
}
