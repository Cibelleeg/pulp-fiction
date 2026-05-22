import type { Cinema } from "../../domain/cinema/Cinema.js";

export interface CinemaRepository {
    findAll(): Promise<Cinema[]>;

    
    findById(id: number): Promise<Cinema | null>;
}

