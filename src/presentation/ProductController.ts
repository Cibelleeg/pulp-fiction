import type { CreateProductUseCase } from "../application/products/CreateProductUseCase.js";
import type { GetProductByIdUseCase } from "../application/products/GetProductByIdUseCase.js";
import type { GetProductUseCase } from "../application/products/GetProductUseCase.js";
import type { DeleteProductUseCase } from "../application/products/DeleteProductUseCase.js";
import type { UpdateProductByIdUseCase } from "../application/products/UpdateProductUseCase.js";
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
                res.status(400).json({ error: "ID inválido." });
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
            const productData = req.body;
            const createdProduct = await this.createProductUseCase.execute(productData);
            res.status(201).json(createdProduct);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error." });
        }
    }
    async deleteProductById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: "ID inválido." });
                return;
            }
            await this.deleteProductByIdUseCase.execute(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error && error.message === "Product not found.") {
                res.status(404).json({ error: "Product not found." });
                return;
            }
            res.status(500).json({ error: "Internal Server Error." });
        }
    }
    async updateProductById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: "ID inválido." });
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
            if (error instanceof Error && error.message === "Product not found.") {
                res.status(404).json({ error: "Product not found." });
                return;
            }
            res.status(500).json({ error: "Internal Server Error." });
        }
    }

}