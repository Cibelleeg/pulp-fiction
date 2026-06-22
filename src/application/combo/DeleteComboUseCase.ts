import type { ComboRepository} from "../../application/combo/ComboRepository.js";

export class DeleteComboUseCase {
  constructor(private comboRepository: ComboRepository) {}

  async execute(id: number): Promise<void> {
    const combo = await this.comboRepository.findById(id);
    if (!combo) throw new Error("Combo not found.");
    return this.comboRepository.deleteById(id);
  }
}