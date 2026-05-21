-- CreateTable
CREATE TABLE "Filme" (
    "id_filme" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "sinopse" TEXT NOT NULL,
    "duracao" TIMESTAMP(3) NOT NULL,
    "classificacao_indicativa" INTEGER NOT NULL,
    "genero" TEXT NOT NULL,
    "data_lancamento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Filme_pkey" PRIMARY KEY ("id_filme")
);
