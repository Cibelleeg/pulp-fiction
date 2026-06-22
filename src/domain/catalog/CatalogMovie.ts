import type { DistribuicaoAvaliacoes } from "./ReviewStats.js";
import { EstatisticaAvaliacoes } from "./ReviewStats.js";

export type EstadoFilme = "cartaz" | "breve" | "encerrado";

export class FilmeCatalogo {
  constructor(
    public readonly id: number,
    public readonly titulo: string,
    public readonly ano: number,
    public readonly duracao: number,
    public readonly classificacao: number,
    public readonly genero: string,
    public readonly sinopse: string,
    public readonly posterUrl: string | null,
    public readonly dataLancamento: Date,
    public readonly dataFimCartaz: Date | null,
    private readonly stats: EstatisticaAvaliacoes,
  ) {}

  media(): number {
    return this.stats.media();
  }

  totalAvaliacoes(): number {
    return this.stats.total();
  }

  distribuicao(): DistribuicaoAvaliacoes {
    return this.stats.getDistribuicao();
  }

  notaPonderada(mediaGlobal: number, minimoAvaliacoes: number): number {
    return this.stats.notaPonderada(mediaGlobal, minimoAvaliacoes);
  }

  generos(): string[] {
    return [this.genero];
  }

  estado(agora = new Date()): EstadoFilme {
    const hoje = new Date(agora);
    hoje.setHours(0, 0, 0, 0);

    const lancamento = new Date(this.dataLancamento);
    lancamento.setHours(0, 0, 0, 0);

    if (lancamento > hoje) return "breve";

    if (this.dataFimCartaz) {
      const fimCartaz = new Date(this.dataFimCartaz);
      fimCartaz.setHours(0, 0, 0, 0);
      if (fimCartaz < hoje) return "encerrado";
    }

    return "cartaz";
  }
}
