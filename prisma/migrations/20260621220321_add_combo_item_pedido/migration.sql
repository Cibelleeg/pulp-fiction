/*
  Warnings:

  - You are about to drop the `ItemPedido` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemPedido" DROP CONSTRAINT "ItemPedido_id_pedido_fkey";

-- DropForeignKey
ALTER TABLE "ItemPedido" DROP CONSTRAINT "ItemPedido_id_produto_fkey";

-- DropTable
DROP TABLE "ItemPedido";

-- CreateTable
CREATE TABLE "combos" (
    "id_combo" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "combos_pkey" PRIMARY KEY ("id_combo")
);

-- CreateTable
CREATE TABLE "item_combos" (
    "id_item_combo" SERIAL NOT NULL,
    "id_combo" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "item_combos_pkey" PRIMARY KEY ("id_item_combo")
);

-- CreateTable
CREATE TABLE "item_pedidos" (
    "id_item_pedido" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_produto" INTEGER,
    "id_combo" INTEGER,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "item_pedidos_pkey" PRIMARY KEY ("id_item_pedido")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_combos_id_combo_id_produto_key" ON "item_combos"("id_combo", "id_produto");

-- AddForeignKey
ALTER TABLE "item_combos" ADD CONSTRAINT "item_combos_id_combo_fkey" FOREIGN KEY ("id_combo") REFERENCES "combos"("id_combo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_combos" ADD CONSTRAINT "item_combos_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produtos"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedidos" ADD CONSTRAINT "item_pedidos_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedidos" ADD CONSTRAINT "item_pedidos_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produtos"("id_produto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedidos" ADD CONSTRAINT "item_pedidos_id_combo_fkey" FOREIGN KEY ("id_combo") REFERENCES "combos"("id_combo") ON DELETE SET NULL ON UPDATE CASCADE;
