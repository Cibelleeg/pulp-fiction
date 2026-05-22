-- CreateTable
CREATE TABLE "produtos" (
    "id_produto" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "estoque" INTEGER NOT NULL,
    "categoria" TEXT NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id_produto")
);

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produtos"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;
