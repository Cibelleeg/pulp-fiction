-- AlterTable
ALTER TABLE "produtos" ADD COLUMN     "sabores" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tamanhos" TEXT[] DEFAULT ARRAY[]::TEXT[];
