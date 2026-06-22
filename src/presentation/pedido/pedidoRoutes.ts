import { Router } from "express";
import { PedidoController } from "./PedidoController.js";
import { PrismaPedidoRepository } from "../../infra/pedido/PrismaPedidoRepository.js";
import { PrismaProductRepository } from "../../infra/products/PrismaProductRepository.js";
import { PrismaComboRepository } from "../../infra/combo/PrismaComboRepository.js";
import { CriarPedidoUseCase } from "../../application/pedido/CriarPedidoUseCase.js";
import { AdicionarItemAoPedidoUseCase } from "../../application/pedido/AdicionarItemAoPedidoUseCase.js";
import { GetPedidoByIdUseCase, GetPedidosByUsuarioUseCase } from "../../application/pedido/GetPedidoUseCase.js";
import { CancelarPedidoUseCase } from "../../application/pedido/CancelarPedidoUseCase.js";
import { DeletePedidoUseCase } from "../../application/pedido/DeletePedidoUseCase.js";
import { authenticate } from "../../infra/http/middlewares/authenticate.js";
import { authorize } from "../../infra/http/middlewares/authorize.js";

const pedidoRepository = new PrismaPedidoRepository();
const productRepository = new PrismaProductRepository();
const comboRepository = new PrismaComboRepository();

const controller = new PedidoController(
  new CriarPedidoUseCase(pedidoRepository, productRepository, comboRepository),
  new AdicionarItemAoPedidoUseCase(pedidoRepository, productRepository, comboRepository),
  new GetPedidoByIdUseCase(pedidoRepository),
  new GetPedidosByUsuarioUseCase(pedidoRepository),
  new CancelarPedidoUseCase(pedidoRepository),
  new DeletePedidoUseCase(pedidoRepository)
);

export const pedidoRoutes = Router();

pedidoRoutes.post("/", authenticate, (req, res) => controller.criarPedido(req, res));
pedidoRoutes.post("/:id/itens", authenticate, (req, res) => controller.adicionarItem(req, res));
pedidoRoutes.get("/:id", authenticate, (req, res) => controller.getPedidoById(req, res));
pedidoRoutes.get("/usuario/:idUsuario", authenticate, (req, res) => controller.getPedidosByUsuario(req, res));
pedidoRoutes.patch("/:id/cancelar", authenticate, (req, res) => controller.cancelarPedido(req, res));
pedidoRoutes.delete("/:id", authenticate, authorize("ADMIN"), (req, res) => controller.deletePedido(req, res));
