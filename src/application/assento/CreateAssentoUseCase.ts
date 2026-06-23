import type { Assento } from "../../domain/assento/Assento.js";
import type { CreateAssentoInput, AssentoRepository } from "./AssentoRepository.js";

export class CreateAssentoUseCase {
  constructor(private assentoRepository: AssentoRepository) {}

  async execute(data: CreateAssentoInput): Promise<Assento> {
    return this.assentoRepository.create(data);
  }
}
