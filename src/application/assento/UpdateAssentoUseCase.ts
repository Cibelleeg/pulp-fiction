import type { Assento } from "../../domain/assento/Assento.js";
import type { UpdateAssentoInput, AssentoRepository } from "./AssentoRepository.js";

export class UpdateAssentoUseCase {
  constructor(private assentoRepository: AssentoRepository) {}

  async execute(id: number, data: UpdateAssentoInput): Promise<Assento> {
    if (Object.keys(data).length === 0) {
      throw new Error("Nenhum dado fornecido para atualização.");
    }
    return this.assentoRepository.updateById(id, data);
  }
}
