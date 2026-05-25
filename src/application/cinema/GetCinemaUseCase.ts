import type { CinemaRepository } from "./CinemaRepository.js";
import type { Cinema } from "../../domain/cinema/Cinema.js";

export class GetCinemaUseCase {
    constructor(private cinemaRepository: CinemaRepository) {}

    async execute(): Promise<Cinema[]> {
        return await this.cinemaRepository.findAll();
    }
}
export class GetCinemaByIdUseCase {
    executeDeleteById(id: number) {
        throw new Error("Method not implemented.");
    }
    constructor(private cinemaRepository: CinemaRepository) {}
    async executeById(id: number): Promise<Cinema | null> {
  return await this.cinemaRepository.findById(id)
    }
}
export class DeleteCinemaByIdUseCase {
    constructor(private cinemaRepository: CinemaRepository) {}
    async executeDeleteById(id: number): Promise<void> {
        const cinema = await this.cinemaRepository.findById(id);
        if (!cinema) { 
            throw new Error("Cinema not found.");
        }
        await this.cinemaRepository.deleteById(id);
    }
}