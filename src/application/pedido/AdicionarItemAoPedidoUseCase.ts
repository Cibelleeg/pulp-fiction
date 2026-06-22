import type { PedidoRepository, CreateItemPedidoInput } from "./PedidoRepository.js";
import type { ProductRepository } from "../products/ProductRepositoy.js";
import type { ComboRepository } from "../combo/ComboRepository.js";
import type { ItemPedido } from "../../domain/pedido/Pedido.js";
import { calcularSubtotal } from "../../domain/pedido/Pedido.js";
import { baixarEstoque } from "../../domain/products/estoque.js";

export class AdicionarItemAoPedidoUseCase {
  constructor(
    private pedidoRepository: PedidoRepository,
    private productRepository: ProductRepository,
    private comboRepository: ComboRepository
  ) {}

  async execute(idPedido: number, itemInput: CreateItemPedidoInput): Promise<ItemPedido> {
    const pedido = await this.pedidoRepository.findById(idPedido);
    if (!pedido) throw new Error(`Pedido ${idPedido} not found.`);

    if (itemInput.idProduto != null && itemInput.idCombo != null) {
      throw new Error("An item cannot have both a product AND a combo at the same time.");
    }
    if (itemInput.idProduto == null && itemInput.idCombo == null) {
      throw new Error("An item must have a product OR a combo.");
    }

    let precoUnitario = itemInput.precoUnitario;

    if (itemInput.idProduto != null) {
      const produto = await this.productRepository.findById(itemInput.idProduto);
      if (!produto) throw new Error(`Produto ${itemInput.idProduto} not found.`);
      const novoEstoque = baixarEstoque(produto, itemInput.quantidade);
      await this.productRepository.updateById(itemInput.idProduto, { ...produto, stock: novoEstoque });
      precoUnitario = produto.price;
    } else if (itemInput.idCombo != null) {
      const combo = await this.comboRepository.findById(itemInput.idCombo);
      if (!combo) throw new Error(`Combo ${itemInput.idCombo} not found.`);
      if (!combo.ativo) throw new Error(`Combo "${combo.nome}" is not active.`);
      for (const itemCombo of combo.itens ?? []) {
        const produto = await this.productRepository.findById(itemCombo.idProduto);
        if (!produto) throw new Error(`Product ${itemCombo.idProduto} from combo not found.`);
        const qtd = itemCombo.quantidade * itemInput.quantidade;
        const novoEstoque = baixarEstoque(produto, qtd);
        await this.productRepository.updateById(itemCombo.idProduto, { ...produto, stock: novoEstoque });
      }
      precoUnitario = combo.preco;
    }

    const subtotal = calcularSubtotal(precoUnitario, itemInput.quantidade);
    const item = await this.pedidoRepository.addItem(idPedido, {
      idProduto: itemInput.idProduto,
      idCombo: itemInput.idCombo,
      quantidade: itemInput.quantidade,
      precoUnitario,
      subtotal,
    });

    await this.pedidoRepository.updateTotal(idPedido, (pedido.total ?? 0) + subtotal);

    return item;
  }
}
