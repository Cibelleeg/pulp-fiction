/*
  Warnings:

  - A unique constraint covering the columns `[id_usuario,id_filme]` on the table `Avaliacao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_sessao,id_assento]` on the table `ingressos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Avaliacao_id_usuario_key";

-- AlterTable
ALTER TABLE "Filme" ADD COLUMN     "data_fim_cartaz" TIMESTAMP(3),
ADD COLUMN     "nota" DOUBLE PRECISION,
ADD COLUMN     "poster" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_id_usuario_id_filme_key" ON "Avaliacao"("id_usuario", "id_filme");

-- CreateIndex
CREATE UNIQUE INDEX "ingressos_id_sessao_id_assento_key" ON "ingressos"("id_sessao", "id_assento");
