import { Router } from "express";
import { CreateProductUseCase } from "../application/products/CreateProductUseCase.js";
import { DeleteProductUseCase } from "../application/products/DeleteProductUseCase.js";
import { GetProductByIdUseCase } from "../application/products/GetProductByIdUseCase.js";
import { GetProductUseCase } from "../application/products/GetProductUseCase.js";
import { UpdateProductByIdUseCase } from "../application/products/UpdateProductUseCase.js";
import { PrismaProductRepository } from "../infra/cinema/products/PrismaProductRepository.js";
import { ProductController } from "./ProductController.js";

const produtctRepository = new PrismaProductRepository();

const getProductUseCase = new GetProductUseCase(produtctRepository);

const getProductByIdUseCase = new GetProductByIdUseCase(produtctRepository);

const createProductUseCase = new CreateProductUseCase(produtctRepository);

const deleteProductUseCase = new DeleteProductUseCase(produtctRepository);

const updateProductByIdUseCase = new UpdateProductByIdUseCase(produtctRepository);

const productController = new ProductController(
    getProductUseCase,
    getProductByIdUseCase,
    createProductUseCase,
    deleteProductUseCase,
    updateProductByIdUseCase
);

const router = Router();

router.get("/", (req, res) => productController.getProducts(req, res));

router.get("/:id", (req, res) => productController.getProductById(req, res));   

router.post("/", (req, res) => productController.createProduct(req, res));

router.delete("/:id", (req, res) => productController.deleteProductById(req, res));

router.put("/:id", (req, res) => productController.updateProductById(req, res));

export { router as productRoutes };