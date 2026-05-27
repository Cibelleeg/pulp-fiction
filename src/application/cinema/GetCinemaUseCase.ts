import type { CinemaRepository } from "./CinemaRepository.js";
import type { Cinema } from "../../domain/cinema/Cinema.js";

export class GetCinemaUseCase {
    constructor(private cinemaRepository: CinemaRepository) {}

    async execute(): Promise<Cinema[]> {
        return await this.cinemaRepository.findAll();
    }
}
export class GetCinemaByIdUseCase {
    constructor(private cinemaRepository: CinemaRepository) {}
    async executeById(id: number): Promise<Cinema | null> {
  return await this.cinemaRepository.findById(id)
    }
}

