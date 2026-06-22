import type { PedidoRepository, CreatePedidoInput } from "./PedidoRepository.js";
import type { ProductRepository } from "../products/ProductRepositoy.js";
import type { ComboRepository } from "../combo/ComboRepository.js";
import type { Pedido } from "../../domain/pedido/Pedido.js";
import { calcularSubtotal, calcularTotal } from "../../domain/pedido/Pedido.js";
import { baixarEstoque, EstoqueInsuficienteError } from "../../domain/products/estoque.js";

export class CriarPedidoUseCase {
  constructor(
    private pedidoRepository: PedidoRepository,
    private productRepository: ProductRepository,
    private comboRepository: ComboRepository
  ) {}

  async execute(data: CreatePedidoInput): Promise<Pedido> {
    const itensComSubtotal: Array<{
      idProduto?: number | null;
      idCombo?: number | null;
      quantidade: number;
      precoUnitario: number;
      subtotal: number;
    }> = [];

    for (const itemInput of data.itens) {
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
        baixarEstoque(produto, itemInput.quantidade);
        precoUnitario = produto.price;
      } else if (itemInput.idCombo != null) {
        const combo = await this.comboRepository.findById(itemInput.idCombo);
        if (!combo) throw new Error(`Combo ${itemInput.idCombo} not found.`);
        if (!combo.ativo) throw new Error(`Combo "${combo.nome}" is not active.`);
        for (const itemCombo of combo.itens ?? []) {
          const produto = await this.productRepository.findById(itemCombo.idProduto);
          if (!produto) throw new Error(`Product ${itemCombo.idProduto} from combo not found.`);
          const qtdNecessaria = itemCombo.quantidade * itemInput.quantidade;
          baixarEstoque(produto, qtdNecessaria);
        }
        precoUnitario = combo.preco;
      }

      itensComSubtotal.push({
        idProduto: itemInput.idProduto,
        idCombo: itemInput.idCombo,
        quantidade: itemInput.quantidade,
        precoUnitario,
        subtotal: calcularSubtotal(precoUnitario, itemInput.quantidade),
      });
    }

    const total = calcularTotal(itensComSubtotal);

    const pedido = await this.pedidoRepository.create({
      idUsuario: data.idUsuario,
      total,
      status: "ABERTO",
      dataPedido: new Date(),
    });

    for (const itemInput of data.itens) {
      if (itemInput.idProduto != null) {
        const produto = await this.productRepository.findById(itemInput.idProduto);
        if (produto) {
          await this.productRepository.updateById(itemInput.idProduto, {
            ...produto,
            stock: produto.stock - itemInput.quantidade,
          });
        }
      } else if (itemInput.idCombo != null) {
        const combo = await this.comboRepository.findById(itemInput.idCombo);
        for (const itemCombo of combo?.itens ?? []) {
          const produto = await this.productRepository.findById(itemCombo.idProduto);
          if (produto) {
            const qtd = itemCombo.quantidade * itemInput.quantidade;
            await this.productRepository.updateById(itemCombo.idProduto, {
              ...produto,
              stock: produto.stock - qtd,
            });
          }
        }
      }
    }

    for (const item of itensComSubtotal) {
      await this.pedidoRepository.addItem(pedido.id, item);
    }

    return { ...pedido, total, itens: itensComSubtotal as any };
  }
}
