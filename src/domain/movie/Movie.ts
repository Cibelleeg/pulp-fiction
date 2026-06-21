export interface Movie {
    id: number;
    title: string;
    synopsis: string;
    duration: number;
    ageRating: number;
    genre: string;
    releaseDate: Date;
    endDate?: Date | null;
    poster?: string | null;
    rating?: number | null;
}

export class Filme {
  constructor(
    public id: number,
    public title: string,
    public synopsis: string,
    public duration: number,
    public ageRating: number,
    public genre: string,
    public releaseDate: Date,
    public endDate?: Date | null,
    public poster?: string | null,
    public rating?: number | null
  ) {}

  permiteIdade(idade: number): boolean {
    return idade >= this.ageRating;
  }
}