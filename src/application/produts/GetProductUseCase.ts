import type { ProductRepository} from "./ProductRepositoy.js";
import type { Product } from "../../domain/product/Product.js";


export class GetProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(): Promise<Product[]> {
        return await this.productRepository.findAll();
    }
}