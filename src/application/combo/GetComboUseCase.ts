import type { ComboRepository} from "../../application/combo/ComboRepository.js";
import type { Combo } from "../../domain/combo/Combo.js";

export class GetCombosUseCase {
  constructor(private comboRepository: ComboRepository) {}

  async execute(): Promise<Combo[]> {
    return this.comboRepository.findAll();
  }
}