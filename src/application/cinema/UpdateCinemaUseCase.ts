import type { CinemaRepository } from "./CinemaRepository.js";
import type { Cinema } from "../../domain/cinema/Cinema.js";

export class UpdateCinemaByIdUseCase {
    constructor(private cinemaRepository: CinemaRepository) {}
    async executeUpdateById(id: number, data: Omit<Cinema, "id"> & { address: Omit<Cinema["address"], "id"> }): Promise<Cinema> {
        const cinema = await this.cinemaRepository.findById(id);
        if (!cinema) {
            throw new Error("Cinema not found.");
        }
        return await this.cinemaRepository.updateById(id, data);
    }
}