import type { Cinema } from "../../domain/cinema/Cinema.js";
import type { CinemaRepository } from "./CinemaRepository.js";

export class CreateCinemaUseCase {
    constructor(private cinemaRepository: CinemaRepository) {}

    async execute(data: Omit<Cinema, "id">): Promise<Cinema> {
        return await this.cinemaRepository.create(data);
    }
}