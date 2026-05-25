import type { Address, Cinema } from "../../domain/cinema/Cinema.js";

export type CreateCinemaInput = Omit<Cinema, "id"> & { address: Omit<Address, "id"> };

export interface CinemaRepository {
    findAll(): Promise<Cinema[]>;

    findById(id: number): Promise<Cinema | null>;

    create(data: CreateCinemaInput): Promise<Cinema>;

    deleteById(id: number): Promise<void>;
}
