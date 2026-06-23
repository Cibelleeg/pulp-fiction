import { DomainError } from "../../domain/error/DomainError.js";
import type { FilmeCatalogo } from "../../domain/catalog/CatalogMovie.js";
import { Sessao } from "../../domain/session/Session.js";
import { Usuario } from "../../domain/user/User.js";
import { TypeIngresso } from "../../domain/ticketType/TicketType.js";
import type { Ingresso } from "../../domain/ingresso/Ingresso.js";
import type { IngressoRepository } from "./IngressoRepository.js";
import type { PedidoRepository } from "../pedido/PedidoRepository.js";
import type { SessionRepository } from "../session/SessionRepository.js";
import type { UserRepository } from "../user/UserRepository.js";
import type { CatalogRepository as MovieRepository } from "../catalog/CatalogRepository.js";

export type ComprarIngressoInput = {
  idSessao: number;
  idUsuario: number;
  idAssento: number;
  idPedido: number;
  tipo: TypeIngresso;
};

export class ComprarIngressoUseCase {
  constructor(
    private ingressoRepository: IngressoRepository,
    private pedidoRepository: PedidoRepository,
    private sessionRepository: SessionRepository,
    private userRepository: UserRepository,
    private movieRepository: MovieRepository
  ) {}

  async execute(input: ComprarIngressoInput): Promise<Ingresso> {
    const sessaoData = await this.sessionRepository.findById(input.idSessao);
    if (!sessaoData) {
      throw new DomainError("Sessão não encontrada.");
    }

    const sessao = new Sessao(
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

    if (!sessao.estaAberta()) {
      throw new DomainError("Sessão encerrada.");
    }

    if (!sessao.temAssentoDisponivel()) {
      throw new DomainError("Sessão esgotada.");
    }

    const pedido = await this.pedidoRepository.findById(input.idPedido);
    if (!pedido) {
      throw new DomainError("Pedido não encontrado.");
    }
    if (pedido.idUsuario !== input.idUsuario) {
      throw new DomainError("Pedido não pertence ao usuário autenticado.");
    }
    if (pedido.status === "CANCELADO") {
      throw new DomainError("Pedido cancelado não pode receber ingresso.");
    }

    const usuarioData = await this.userRepository.findById(input.idUsuario);
    if (!usuarioData) {
      throw new DomainError("Usuário não encontrado.");
    }
    if (!usuarioData.birthDate) {
      throw new DomainError("Usuário sem data de nascimento cadastrada.");
    }

    const usuario = new Usuario(
      usuarioData.id,
      usuarioData.name ?? "",
      usuarioData.email,
      usuarioData.cpf ?? "",
      usuarioData.phoneNumber ?? "",
      usuarioData.birthDate,
      usuarioData.role
    );

    const filmeData = await this.movieRepository.findCatalogMovieById(sessaoData.movieId);
    if (!filmeData) {
      throw new DomainError("Filme não encontrado.");
    }
    const filme: FilmeCatalogo = filmeData;

    if (usuario.idadeEm() < filme.classificacao) {
      throw new DomainError("Classificação indicativa não permite a compra para este usuário.");
    }

    const assentoOcupado = await this.ingressoRepository.findBySessaoAndAssento(
      input.idSessao,
      input.idAssento
    );
    if (assentoOcupado) {
      throw new DomainError("Assento já ocupado.");
    }

    const meiasVendidas = input.tipo === TypeIngresso.MEIA
      ? await this.ingressoRepository.countMeiasBySessao(input.idSessao)
      : 0;

    const preco = sessao.calcularPreco(input.tipo, meiasVendidas);

    return await this.ingressoRepository.create({
      idSessao: input.idSessao,
      idUsuario: input.idUsuario,
      idAssento: input.idAssento,
      idPedido: input.idPedido,
      tipo: input.tipo,
      preco,
      status: "ATIVO",
      dataEmissao: new Date(),
    });
  }
}
