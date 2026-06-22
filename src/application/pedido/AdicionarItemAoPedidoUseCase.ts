import type { PedidoRepository, CreateItemPedidoInput, StockUpdate } from "./PedidoRepository.js";
import type { ProductRepository } from "../products/ProductRepositoy.js";
import type { ComboRepository } from "../combo/ComboRepository.js";
import type { ItemPedido } from "../../domain/pedido/Pedido.js";
import { calcularSubtotal } from "../../domain/pedido/Pedido.js";
import { baixarEstoque } from "../../domain/products/estoque.js";
import type { Product } from "../../domain/products/Product.js";

export class AdicionarItemAoPedidoUseCase {
  constructor(
    private pedidoRepository: PedidoRepository,
    private productRepository: ProductRepository,
    private comboRepository: ComboRepository
  ) {}

  async execute(idPedido: number, itemInput: CreateItemPedidoInput): Promise<ItemPedido> {
    const pedido = await this.pedidoRepository.findById(idPedido);
    if (!pedido) throw new Error(`Pedido ${idPedido} not found.`);

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
    const produtos = new Map<number, Product>();
    const consumoPorProduto = new Map<number, number>();

    if (itemInput.idProduto != null) {
      const produto = await this.productRepository.findById(itemInput.idProduto);
      if (!produto) throw new Error(`Produto ${itemInput.idProduto} not found.`);
      produtos.set(produto.id, produto);
      consumoPorProduto.set(produto.id, itemInput.quantidade);
      precoUnitario = produto.price;
    } else if (itemInput.idCombo != null) {
      const combo = await this.comboRepository.findById(itemInput.idCombo);
      if (!combo) throw new Error(`Combo ${itemInput.idCombo} not found.`);
      if (!combo.ativo) throw new Error(`Combo "${combo.nome}" is not active.`);
      for (const itemCombo of combo.itens ?? []) {
        const produto = await this.productRepository.findById(itemCombo.idProduto);
        if (!produto) throw new Error(`Product ${itemCombo.idProduto} from combo not found.`);
        const qtd = itemCombo.quantidade * itemInput.quantidade;
        produtos.set(produto.id, produto);
        consumoPorProduto.set(produto.id, (consumoPorProduto.get(produto.id) ?? 0) + qtd);
      }
      precoUnitario = combo.preco;
    }

    for (const [idProduto, quantidade] of consumoPorProduto) {
      const produto = produtos.get(idProduto);
      if (!produto) throw new Error(`Produto ${idProduto} not found.`);
      baixarEstoque(produto, quantidade);
    }

    const subtotal = calcularSubtotal(precoUnitario, itemInput.quantidade);
    const stockUpdates: StockUpdate[] = Array.from(consumoPorProduto, ([idProduto, quantidade]) => {
      const produto = produtos.get(idProduto);
      if (!produto) throw new Error(`Produto ${idProduto} not found.`);
      return {
        idProduto,
        nomeProduto: produto.name,
        quantidade,
      };
    });

    return await this.pedidoRepository.addItemWithStockUpdate(
      idPedido,
      {
        idProduto: itemInput.idProduto ?? null,
        idCombo: itemInput.idCombo ?? null,
        quantidade: itemInput.quantidade,
        precoUnitario,
        subtotal,
      },
      stockUpdates,
      subtotal
    );
  }
}
