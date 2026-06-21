import type { CreateProductUseCase } from "../../application/products/CreateProductUseCase.js";
import type { GetProductByIdUseCase } from "../../application/products/GetProductByIdUseCase.js";
import type { GetProductUseCase } from "../../application/products/GetProductUseCase.js";
import type { DeleteProductUseCase } from "../../application/products/DeleteProductUseCase.js";
import type { UpdateProductByIdUseCase } from "../../application/products/UpdateProductUseCase.js";
import type { Request, Response } from "express";

export class ProductController {
    constructor(
        private getProductUseCase: GetProductUseCase,
        private getProductByIdUseCase: GetProductByIdUseCase,
        private createProductUseCase: CreateProductUseCase,
        private deleteProductByIdUseCase: DeleteProductUseCase,
        private updateProductByIdUseCase: UpdateProductByIdUseCase
    ) { }

    async getProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await this.getProductUseCase.execute();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
    }
    async getProductById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: "Invalid ID." });
                return;
            }
            const product = await this.getProductByIdUseCase.execute(id);
            if (!product) {
                res.status(404).json({ error: "Product not found." });
                return;
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
    }
    async createProduct(req: Request, res: Response): Promise<void> {
        try {
            const { name, description, price, stock, category } = req.body as {
                name?: string;
                description?: string;
                price?: number | string;
                stock?: number | string;
                category?: string;
            };

            if (
                name === undefined || description === undefined || price === undefined || stock === undefined || category === undefined
            ) {
                throw new Error("All fields are required.");
            }

            const productData = {
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
                stock: Number(stock),
                category: category.trim(),
            };

            if (Number.isNaN(productData.price)) {
                throw new Error("Price must be a valid number.");
            }

            if (Number.isNaN(productData.stock)) {
                throw new Error("Stock must be a valid number.");
            }

            if (productData.price < 0) {
                throw new Error("Price cannot be negative.");
            }

            if (productData.stock < 0) {
                throw new Error("Stock cannot be negative.");
            }

            const createdProduct = await this.createProductUseCase.execute(productData);

            res.status(201).json({ message: "Product created successfully.", product: createdProduct });

        } catch (error) {

            if (error instanceof Error) {
                
                res.status(400).json({ error: error.message });
                return;
            }

            res.status(500).json({ error: "Internal Server Error." });
        }
    }
    async deleteProductById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: "Invalid ID." });
                return;
            }
            await this.deleteProductByIdUseCase.execute(id);
            res.status(204).json({message: "Product deleted successfully."});
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Internal Server Error." });
        }
    }
    async updateProductById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: "Invalid ID." });
                return;
            }
            const data = req.body;
            const updatedProduct = await this.updateProductByIdUseCase.execute(id, data);
            if (!updatedProduct) {
                res.status(404).json({ error: "Product not found." });
                return;
            }
            res.status(200).json(updatedProduct);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Internal Server Error." });
        }
    }

}