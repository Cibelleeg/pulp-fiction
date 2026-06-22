import type { ComboRepository, CreateComboInput} from "../../application/combo/ComboRepository.js";
import type { Combo } from "../../domain/combo/Combo.js";

export class CreateComboUseCase {
  constructor(private comboRepository: ComboRepository) {}

  async execute(data: CreateComboInput): Promise<Combo> {
    return this.comboRepository.create(data);
  }
}