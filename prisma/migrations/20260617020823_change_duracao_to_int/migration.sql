/*
  Warnings:

  - Changed the type of `duracao` on the `Filme` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Filme" DROP COLUMN "duracao",
ADD COLUMN     "duracao" INTEGER NOT NULL;
