import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "../../config.js";

import type { Product } from "../../domain/products/Product.js";
import type { ProductRepository } from "../../application/products/ProductRepositoy.js";
import type { CreateProductInput } from "../../application/products/ProductRepositoy.js";


function createPrismaClient(): PrismaClient {
    const adapter = new PrismaPg({ connectionString: config.databaseUrl });
    return new PrismaClient({ adapter });
}

export class PrismaProductRepository implements ProductRepository {
    constructor(private prisma: PrismaClient = createPrismaClient()) { }

    async findAll(): Promise<Product[]> {
        const products = await this.prisma.produto.findMany();
        return products.map((product: any) => ({
            id: product.idProduto,
            name: product.nome,
            description: product.descricao,
            price: product.preco,
            stock: product.estoque,
            category: product.categoria,
            poster: product.poster,
        }))
    }

    async findById(id: number): Promise<Product | null> {
        const product = await this.prisma.produto.findUnique(
            { where: { idProduto: id } });

        if (!product) {
            return null;
        }

        return {
            id: product.idProduto,
            name: product.nome,
            description: product.descricao,
            price: product.preco,
            stock: product.estoque,
            category: product.categoria,
            poster: product.poster,
        };
    }

    async create(data: CreateProductInput): Promise<Product> {
        const createdProduct = await this.prisma.produto.create({
            data: {     
                nome: data.name,
                descricao: data.description,
                preco: data.price,
                estoque: data.stock,
                categoria: data.category,
                poster: data.poster,
            },
        });

        return {
            id: createdProduct.idProduto,
            name: createdProduct.nome,  
            description: createdProduct.descricao,
            price: createdProduct.preco,
            stock: createdProduct.estoque,
            category: createdProduct.categoria,
            poster: createdProduct.poster,
        };
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.produto.delete({ where: { idProduto: id } });
    }

    async updateById(id: number, data: Omit<Product, "id">): Promise<Product> {
        const updatedProduct = await this.prisma.produto.update({
            where: { idProduto: id },
            data: {
                nome: data.name,
                descricao: data.description,
                preco: data.price,
                estoque: data.stock,
                categoria: data.category,
                poster: data.poster,
            },
        });
        return {
            id: updatedProduct.idProduto,
            name: updatedProduct.nome,
            description: updatedProduct.descricao,
            price: updatedProduct.preco,
            stock: updatedProduct.estoque,
            category: updatedProduct.categoria,
            poster: updatedProduct.poster,
        };
    }

}