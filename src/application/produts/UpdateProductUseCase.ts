import type { ProductRepository } from "./ProductRepositoy.js";
import type { Product } from "../../domain/product/Product.js";

export class UpdateProductByIdUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(id: number, data: Omit<Product, "id">): Promise<Product> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error("Product not found.");
        }
        return await this.productRepository.updateById(id, data);
    }
}