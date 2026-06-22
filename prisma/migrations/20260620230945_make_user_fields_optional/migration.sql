-- AlterTable
ALTER TABLE "Filme" ADD COLUMN     "data_fim_cartaz" TIMESTAMP(3),
ADD COLUMN     "nota" DOUBLE PRECISION,
ADD COLUMN     "poster" TEXT;

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "nome" DROP NOT NULL,
ALTER COLUMN "cpf" DROP NOT NULL,
ALTER COLUMN "telefone" DROP NOT NULL,
ALTER COLUMN "data_nascimento" DROP NOT NULL;
