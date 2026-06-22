type Nota = 1 | 2 | 3 | 4 | 5;

export type DistribuicaoAvaliacoes = Record<Nota, number>;

export class EstatisticaAvaliacoes {
  constructor(private readonly distribuicao: DistribuicaoAvaliacoes) {}

  total(): number {
    return Object.values(this.distribuicao).reduce((acc, value) => acc + value, 0);
  }

  media(): number {
    const total = this.total();
    if (total === 0) return 0;

    const soma = ([1, 2, 3, 4, 5] as const).reduce(
      (acc, nota) => acc + nota * this.distribuicao[nota],
      0,
    );

    return soma / total;
  }

  getDistribuicao(): DistribuicaoAvaliacoes {
    return { ...this.distribuicao };
  }

  notaPonderada(mediaGlobal: number, minimoAvaliacoes: number): number {
    const total = this.total();
    if (total === 0) return 0;

    const media = this.media();
    return (total / (total + minimoAvaliacoes)) * media +
      (minimoAvaliacoes / (total + minimoAvaliacoes)) * mediaGlobal;
  }
}

export function distribuicaoVazia(): DistribuicaoAvaliacoes {
  return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
}
