import type { Cinema } from "../../domain/cinema/Cinema.js";
import type { CinemaRepository, CreateCinemaInput } from "./CinemaRepository.js";

export class CreateCinemaUseCase {
    constructor(private cinemaRepository: CinemaRepository) {}

    async execute(data: CreateCinemaInput): Promise<Cinema> {
        return this.cinemaRepository.create(data);
    }
}