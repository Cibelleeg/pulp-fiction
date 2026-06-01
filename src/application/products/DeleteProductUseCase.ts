import type { ProductRepository} from "./ProductRepositoy.js";

export class DeleteProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(id: number): Promise<void> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error("Product not found.");
        }
        await this.productRepository.deleteById(id);
    }
}