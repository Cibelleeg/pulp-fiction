-- CreateTable
CREATE TABLE "salas" (
    "id_sala" SERIAL NOT NULL,
    "id_cinema" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "salas_pkey" PRIMARY KEY ("id_sala")
);

-- AddForeignKey
ALTER TABLE "salas" ADD CONSTRAINT "salas_id_cinema_fkey" FOREIGN KEY ("id_cinema") REFERENCES "cinemas"("id_cinema") ON DELETE RESTRICT ON UPDATE CASCADE;
