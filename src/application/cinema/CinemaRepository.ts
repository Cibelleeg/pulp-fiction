import type { Address, Cinema } from "../../domain/cinema/Cinema.js";

export type CreateCinemaInput = Omit<Cinema, "id"> & { address: Omit<Address, "id"> };

export interface CinemaRepository {
    findAll(): Promise<Cinema[]>;
    create(data: CreateCinemaInput): Promise<Cinema>;
}