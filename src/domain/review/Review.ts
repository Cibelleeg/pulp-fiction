export interface Review {
  id: number;
  movieId: number;
  userId: number;
  rating: number;
  comment: string;
  reviewDate: Date;
}