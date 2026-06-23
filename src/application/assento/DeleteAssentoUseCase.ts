import type { AssentoRepository } from "./AssentoRepository.js";

export class DeleteAssentoUseCase {
  constructor(private assentoRepository: AssentoRepository) {}

  async execute(id: number): Promise<void> {
    return this.assentoRepository.deleteById(id);
  }
}
