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
