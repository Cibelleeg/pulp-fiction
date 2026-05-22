import type { CinemaRepository } from "./CinemaRepository.js";
import type { Cinema } from "../../domain/cinema/Cinema.js";

export class GetCinemaUseCase {
    constructor(private cinemaRepository: CinemaRepository) {}

    async execute(): Promise<Cinema[]> {
        return await this.cinemaRepository.findAll();
    }
}