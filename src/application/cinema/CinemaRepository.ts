import type { Cinema } from "../../domain/cinema/Cinema.js";

export interface CinemaRepository {
    findAll(): Promise<Cinema[]>;
    create(data: Omit<Cinema, "id">): Promise<Cinema>;
}