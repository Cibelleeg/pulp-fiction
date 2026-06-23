import type { Sala } from "../../domain/sala/Sala.js";
import type { SalaRepository } from "./SalaRepository.js";

export class GetSalasUseCase {
  constructor(private salaRepository: SalaRepository) {}
  async execute(): Promise<Sala[]> {
    return this.salaRepository.findAll();
  }
}

export class GetSalaByIdUseCase {
  constructor(private salaRepository: SalaRepository) {}
  async execute(id: number): Promise<Sala | null> {
    return this.salaRepository.findById(id);
  }
}

export class GetSalasByCinemaUseCase {
  constructor(private salaRepository: SalaRepository) {}
  async execute(idCinema: number): Promise<Sala[]> {
    return this.salaRepository.findByCinema(idCinema);
  }
}
