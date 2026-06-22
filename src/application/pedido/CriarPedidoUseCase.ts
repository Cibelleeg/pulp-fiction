import type { PedidoRepository, CreatePedidoInput, StockUpdate } from "./PedidoRepository.js";
import type { ProductRepository } from "../products/ProductRepositoy.js";
import type { ComboRepository } from "../combo/ComboRepository.js";
import type { Pedido } from "../../domain/pedido/Pedido.js";
import { calcularSubtotal, calcularTotal } from "../../domain/pedido/Pedido.js";
import { baixarEstoque } from "../../domain/products/estoque.js";
import type { Product } from "../../domain/products/Product.js";

export class CriarPedidoUseCase {
  constructor(
    private pedidoRepository: PedidoRepository,
    private productRepository: ProductRepository,
    private comboRepository: ComboRepository
  ) {}

  async execute(data: CreatePedidoInput): Promise<Pedido> {
    if (!Number.isInteger(data.idUsuario) || data.idUsuario <= 0) {
      throw new Error("Invalid user ID.");
    }
    if (data.itens.length === 0) {
      throw new Error("Order must have at least one item.");
    }

    const itensComSubtotal: Array<{
      idProduto: number | null;
      idCombo: number | null;
      quantidade: number;
      precoUnitario: number;
      subtotal: number;
    }> = [];
    const produtos = new Map<number, Product>();
    const consumoPorProduto = new Map<number, number>();

    for (const itemInput of data.itens) {
      if (!Number.isInteger(itemInput.quantidade) || itemInput.quantidade <= 0) {
        throw new Error("Item quantity must be greater than zero.");
      }
      if (itemInput.idProduto != null && itemInput.idCombo != null) {
        throw new Error("An item cannot have both a product AND a combo at the same time.");
      }
      if (itemInput.idProduto == null && itemInput.idCombo == null) {
        throw new Error("An item must have a product OR a combo.");
      }
      if (itemInput.idProduto != null && (!Number.isInteger(itemInput.idProduto) || itemInput.idProduto <= 0)) {
        throw new Error("Invalid product ID.");
      }
      if (itemInput.idCombo != null && (!Number.isInteger(itemInput.idCombo) || itemInput.idCombo <= 0)) {
        throw new Error("Invalid combo ID.");
      }

      let precoUnitario = itemInput.precoUnitario;

      if (itemInput.idProduto != null) {
        const produto = await this.productRepository.findById(itemInput.idProduto);
        if (!produto) throw new Error(`Produto ${itemInput.idProduto} not found.`);
        produtos.set(produto.id, produto);
        consumoPorProduto.set(produto.id, (consumoPorProduto.get(produto.id) ?? 0) + itemInput.quantidade);
        precoUnitario = produto.price;
      } else if (itemInput.idCombo != null) {
        const combo = await this.comboRepository.findById(itemInput.idCombo);
        if (!combo) throw new Error(`Combo ${itemInput.idCombo} not found.`);
        if (!combo.ativo) throw new Error(`Combo "${combo.nome}" is not active.`);
        for (const itemCombo of combo.itens ?? []) {
          const produto = await this.productRepository.findById(itemCombo.idProduto);
          if (!produto) throw new Error(`Product ${itemCombo.idProduto} from combo not found.`);
          const qtdNecessaria = itemCombo.quantidade * itemInput.quantidade;
          produtos.set(produto.id, produto);
          consumoPorProduto.set(produto.id, (consumoPorProduto.get(produto.id) ?? 0) + qtdNecessaria);
        }
        precoUnitario = combo.preco;
      }

      itensComSubtotal.push({
        idProduto: itemInput.idProduto ?? null,
        idCombo: itemInput.idCombo ?? null,
        quantidade: itemInput.quantidade,
        precoUnitario,
        subtotal: calcularSubtotal(precoUnitario, itemInput.quantidade),
      });
    }

    for (const [idProduto, quantidade] of consumoPorProduto) {
      const produto = produtos.get(idProduto);
      if (!produto) throw new Error(`Produto ${idProduto} not found.`);
      baixarEstoque(produto, quantidade);
    }

    const total = calcularTotal(itensComSubtotal);
    const stockUpdates: StockUpdate[] = Array.from(consumoPorProduto, ([idProduto, quantidade]) => {
      const produto = produtos.get(idProduto);
      if (!produto) throw new Error(`Produto ${idProduto} not found.`);
      return {
        idProduto,
        nomeProduto: produto.name,
        quantidade,
      };
    });

    return await this.pedidoRepository.createWithItemsAndStockUpdate(
      {
        idUsuario: data.idUsuario,
        total,
        status: "ABERTO",
        dataPedido: new Date(),
      },
      itensComSubtotal,
      stockUpdates
    );
  }
}
