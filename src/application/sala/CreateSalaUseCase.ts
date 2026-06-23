import type { Sala } from "../../domain/sala/Sala.js";
import type { CreateSalaInput, SalaRepository } from "./SalaRepository.js";

export class CreateSalaUseCase {
  constructor(private salaRepository: SalaRepository) {}

  async execute(data: CreateSalaInput): Promise<Sala> {
    return this.salaRepository.create(data);
  }
}
