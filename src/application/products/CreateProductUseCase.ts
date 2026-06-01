import type {ProductRepository} from "./ProductRepositoy.js";
import type { Product } from "../../domain/products/Product.js";
import type { CreateProductInput } from "./ProductRepositoy.js";

export class CreateProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(data: CreateProductInput): Promise<Product> {
        return this.productRepository.create(data);
    }   

}