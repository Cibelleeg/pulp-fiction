import type { Product } from "../products/Product.js";

export class EstoqueInsuficienteError extends Error {
  constructor(nomeProduto: string, disponivel: number, solicitado: number) {
    super(
      `Insufficient stock for  "${nomeProduto}": available  ${disponivel}, requested ${solicitado}.`
    );
    this.name = "EstoqueInsuficienteError";
  }
}

export function baixarEstoque(produto: Product, quantidade: number): number {
  if (quantidade > produto.stock) {
    throw new EstoqueInsuficienteError(produto.name, produto.stock, quantidade);
  }
  return produto.stock - quantidade;
}
