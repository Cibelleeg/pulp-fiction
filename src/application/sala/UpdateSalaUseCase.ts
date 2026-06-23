import type { Sala } from "../../domain/sala/Sala.js";
import type { UpdateSalaInput, SalaRepository } from "./SalaRepository.js";

export class UpdateSalaUseCase {
  constructor(private salaRepository: SalaRepository) {}

  async execute(id: number, data: UpdateSalaInput): Promise<Sala> {
    if (Object.keys(data).length === 0) {
      throw new Error("Nenhum dado fornecido para atualização.");
    }
    return this.salaRepository.updateById(id, data);
  }
}
