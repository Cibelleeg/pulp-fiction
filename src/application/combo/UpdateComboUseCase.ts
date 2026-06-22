import type { ComboRepository, UpdateComboInput} from "../../application/combo/ComboRepository.js";
import type { Combo } from "../../domain/combo/Combo.js";

export class UpdateComboUseCase {
  constructor(private comboRepository: ComboRepository) {}

  async execute(id: number, data: UpdateComboInput): Promise<Combo> {
    const existing = await this.comboRepository.findById(id);
    if (!existing) {
      throw new Error("Combo not found.");
    }

    return this.comboRepository.updateById(id, {
      nome: data.nome,
      descricao: data.descricao,
      preco: data.preco,
      ativo: data.ativo,
    });
  }
}
