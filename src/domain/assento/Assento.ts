export interface Assento {
  id: number;
  idSala: number;
  numero: string;
  fila: string;
  tipo: string;
  ocupado?: boolean;
}
