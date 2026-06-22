import type { ComboRepository} from "../../application/combo/ComboRepository.js";
import type { Combo } from "../../domain/combo/Combo.js";

export class GetComboByIdUseCase {
  constructor(private comboRepository: ComboRepository) {}

  async execute(id: number): Promise<Combo | null> {
    return this.comboRepository.findById(id);
  }
}