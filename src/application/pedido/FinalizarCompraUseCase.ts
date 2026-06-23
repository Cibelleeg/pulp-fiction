import { DomainError } from "../../domain/error/DomainError.js";
import type { FilmeCatalogo } from "../../domain/catalog/CatalogMovie.js";
import { Sessao } from "../../domain/session/Session.js";
import { Usuario } from "../../domain/user/User.js";
import { TypeIngresso } from "../../domain/ticketType/TicketType.js";
import { baixarEstoque } from "../../domain/products/estoque.js";
import type { Product } from "../../domain/products/Product.js";
import type { Pedido } from "../../domain/pedido/Pedido.js";
import { calcularSubtotal, calcularTotal } from "../../domain/pedido/Pedido.js";
import type { CatalogRepository as MovieRepository } from "../catalog/CatalogRepository.js";
import type { ComboRepository } from "../combo/ComboRepository.js";
import type { IngressoRepository } from "../ingresso/IngressoRepository.js";
import type { PedidoRepository, StockUpdate } from "./PedidoRepository.js";
import type { ProductRepository } from "../products/ProductRepositoy.js";
import type { SessionRepository } from "../session/SessionRepository.js";
import type { UserRepository } from "../user/UserRepository.js";

export type FinalizarCompraInput = {
  idUsuario: number;
  idSessao: number;
  idAssento: number;
  tipo: TypeIngresso;
  itens: Array<{
    idProduto?: number | null;
    idCombo?: number | null;
    quantidade: number;
    precoUnitario?: number;
  }>;
};

export class FinalizarCompraUseCase {
  constructor(
    private pedidoRepository: PedidoRepository,
    private ingressoRepository: IngressoRepository,
    private sessionRepository: SessionRepository,
    private userRepository: UserRepository,
    private movieRepository: MovieRepository,
    private productRepository: ProductRepository,
    private comboRepository: ComboRepository
  ) {}

  async execute(input: FinalizarCompraInput): Promise<Pedido> {
    const sessao = await this.getSessao(input.idSessao);
    if (!sessao.estaAberta()) throw new DomainError("Sessão encerrada.");
    if (!sessao.temAssentoDisponivel()) throw new DomainError("Sessão esgotada.");

    const usuario = await this.getUsuario(input.idUsuario);
    const filme = await this.getFilme(sessao.movieId);
    if (usuario.idadeEm() < filme.classificacao) {
      throw new DomainError("Classificação indicativa não permite a compra para este usuário.");
    }

    const assentoOcupado = await this.ingressoRepository.findBySessaoAndAssento(input.idSessao, input.idAssento);
    if (assentoOcupado) throw new DomainError("Assento já ocupado.");

    const meiasVendidas = input.tipo === TypeIngresso.MEIA
      ? await this.ingressoRepository.countMeiasBySessao(input.idSessao)
      : 0;
    const precoIngresso = sessao.calcularPreco(input.tipo, meiasVendidas);

    const { itensComSubtotal, stockUpdates } = await this.prepararItens(input.itens ?? []);
    const total = calcularTotal(itensComSubtotal) + precoIngresso;

    return this.pedidoRepository.createWithItemsStockAndTicket(
      {
        idUsuario: input.idUsuario,
        total,
        status: "ABERTO",
        dataPedido: new Date(),
      },
      itensComSubtotal,
      stockUpdates,
      {
        idSessao: input.idSessao,
        idUsuario: input.idUsuario,
        idAssento: input.idAssento,
        tipo: input.tipo,
        preco: precoIngresso,
        status: "ATIVO",
        dataEmissao: new Date(),
      }
    );
  }

  private async getSessao(idSessao: number): Promise<Sessao> {
    const sessaoData = await this.sessionRepository.findById(idSessao);
    if (!sessaoData) throw new DomainError("Sessão não encontrada.");

    return new Sessao(
      sessaoData.id,
      sessaoData.movieId,
      sessaoData.roomId,
      sessaoData.cinemaId,
      sessaoData.dateTime,
      sessaoData.language,
      sessaoData.format,
      sessaoData.basePrice,
      sessaoData.roomName,
      sessaoData.roomType,
      sessaoData.totalSeats,
      sessaoData.availableSeats
    );
  }

  private async getUsuario(idUsuario: number): Promise<Usuario> {
    const usuarioData = await this.userRepository.findById(idUsuario);
    if (!usuarioData) throw new DomainError("Usuário não encontrado.");
    if (!usuarioData.birthDate) throw new DomainError("Usuário sem data de nascimento cadastrada.");

    return new Usuario(
      usuarioData.id,
      usuarioData.name ?? "",
      usuarioData.email,
      usuarioData.cpf ?? "",
      usuarioData.phoneNumber ?? "",
      usuarioData.birthDate,
      usuarioData.role
    );
  }

  private async getFilme(idFilme: number): Promise<FilmeCatalogo> {
    const filme = await this.movieRepository.findCatalogMovieById(idFilme);
    if (!filme) throw new DomainError("Filme não encontrado.");
    return filme;
  }

  private async prepararItens(itens: FinalizarCompraInput["itens"]): Promise<{
    itensComSubtotal: Array<{
      idProduto: number | null;
      idCombo: number | null;
      quantidade: number;
      precoUnitario: number;
      subtotal: number;
    }>;
    stockUpdates: StockUpdate[];
  }> {
    const itensComSubtotal = [];
    const produtos = new Map<number, Product>();
    const consumoPorProduto = new Map<number, number>();

    for (const item of itens) {
      if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
        throw new Error("Item quantity must be greater than zero.");
      }
      if (item.idProduto != null && item.idCombo != null) {
        throw new Error("An item cannot have both a product AND a combo at the same time.");
      }
      if (item.idProduto == null && item.idCombo == null) {
        throw new Error("An item must have a product OR a combo.");
      }

      let precoUnitario = item.precoUnitario ?? 0;
      if (item.idProduto != null) {
        const produto = await this.productRepository.findById(Number(item.idProduto));
        if (!produto) throw new Error(`Produto ${item.idProduto} not found.`);
        produtos.set(produto.id, produto);
        consumoPorProduto.set(produto.id, (consumoPorProduto.get(produto.id) ?? 0) + item.quantidade);
        precoUnitario = produto.price;
      } else if (item.idCombo != null) {
        const combo = await this.comboRepository.findById(Number(item.idCombo));
        if (!combo) throw new Error(`Combo ${item.idCombo} not found.`);
        if (!combo.ativo) throw new Error(`Combo "${combo.nome}" is not active.`);
        for (const itemCombo of combo.itens ?? []) {
          const produto = await this.productRepository.findById(itemCombo.idProduto);
          if (!produto) throw new Error(`Product ${itemCombo.idProduto} from combo not found.`);
          const quantidade = itemCombo.quantidade * item.quantidade;
          produtos.set(produto.id, produto);
          consumoPorProduto.set(produto.id, (consumoPorProduto.get(produto.id) ?? 0) + quantidade);
        }
        precoUnitario = combo.preco;
      }

      itensComSubtotal.push({
        idProduto: item.idProduto != null ? Number(item.idProduto) : null,
        idCombo: item.idCombo != null ? Number(item.idCombo) : null,
        quantidade: item.quantidade,
        precoUnitario,
        subtotal: calcularSubtotal(precoUnitario, item.quantidade),
      });
    }

    for (const [idProduto, quantidade] of consumoPorProduto) {
      const produto = produtos.get(idProduto);
      if (!produto) throw new Error(`Produto ${idProduto} not found.`);
      baixarEstoque(produto, quantidade);
    }

    const stockUpdates: StockUpdate[] = Array.from(consumoPorProduto, ([idProduto, quantidade]) => {
      const produto = produtos.get(idProduto);
      if (!produto) throw new Error(`Produto ${idProduto} not found.`);
      return { idProduto, nomeProduto: produto.name, quantidade };
    });

    return { itensComSubtotal, stockUpdates };
  }
}
