import type { Product } from "../../domain/products/Product.js";

export type CreateProductInput = Omit<Product, "id">;

export interface ProductRepository {
    findAll(): Promise<Product[]>;

    findById(id: number): Promise<Product | null>;

    create(data: CreateProductInput): Promise<Product>;

    deleteById(id: number): Promise<void>;

    updateById(id: number, data: Omit<Product, "id">): Promise<Product>;
}
