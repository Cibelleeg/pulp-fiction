import type { CinemaRepository, UpdateCinemaInput } from "./CinemaRepository.js";
import type { Cinema } from "../../domain/cinema/Cinema.js";

export class UpdateCinemaByIdUseCase {
    constructor(private cinemaRepository: CinemaRepository) {}
    async executeUpdateById(id: number, data: UpdateCinemaInput): Promise<Cinema> {
        const cinema = await this.cinemaRepository.findById(id);
        if (!cinema) {
            throw new Error("Cinema not found.");
        }

        if (data.cnpj !== undefined) {
            const existingCnpjUser = await this.cinemaRepository.findByCnpj(data.cnpj);

            if (existingCnpjUser && existingCnpjUser.id !== id) {
                throw new Error("CNPJ already in use.");
            }
        }

        if (!data || (Object.keys(data).length === 0) || (data.address && Object.keys(data.address).length === 0 && Object.keys(data).length === 1)) {
            throw new Error("No data provided.");
        }

        return await this.cinemaRepository.updateById(id, data);
    }
} 