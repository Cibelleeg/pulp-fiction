import type { ProductRepository} from "./ProductRepositoy.js";
import type { Product } from "../../domain/product/Product.js";

export class GetProductByIdUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(id: number): Promise<Product | null> {
        return await this.productRepository.findById(id);
    }
}