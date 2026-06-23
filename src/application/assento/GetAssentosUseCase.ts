import type { Assento } from "../../domain/assento/Assento.js";
import type { AssentoRepository } from "./AssentoRepository.js";

export class GetAssentosUseCase {
  constructor(private assentoRepository: AssentoRepository) {}
  async execute(): Promise<Assento[]> {
    return this.assentoRepository.findAll();
  }
}

export class GetAssentoByIdUseCase {
  constructor(private assentoRepository: AssentoRepository) {}
  async execute(id: number): Promise<Assento | null> {
    return this.assentoRepository.findById(id);
  }
}

export class GetAssentosBySalaUseCase {
  constructor(private assentoRepository: AssentoRepository) {}
  async execute(idSala: number): Promise<Assento[]> {
    return this.assentoRepository.findBySala(idSala);
  }
}
