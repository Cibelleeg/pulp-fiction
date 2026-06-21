/*
  Warnings:

  - A unique constraint covering the columns `[id_usuario,id_filme]` on the table `Avaliacao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_sessao,id_assento]` on the table `ingressos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX IF EXISTS "Avaliacao_id_usuario_key";

-- AlterTable
ALTER TABLE "Filme" ADD COLUMN IF NOT EXISTS "data_fim_cartaz" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "nota" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "poster" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Avaliacao_id_usuario_id_filme_key" ON "Avaliacao"("id_usuario", "id_filme");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ingressos_id_sessao_id_assento_key" ON "ingressos"("id_sessao", "id_assento");
