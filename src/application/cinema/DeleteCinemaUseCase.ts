import type { CinemaRepository } from "./CinemaRepository.js";


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