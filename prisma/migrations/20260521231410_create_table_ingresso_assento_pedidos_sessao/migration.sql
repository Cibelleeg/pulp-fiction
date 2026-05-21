-- CreateTable
CREATE TABLE "ingressos" (
    "id_ingresso" SERIAL NOT NULL,
    "id_sessao" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_assento" INTEGER NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "preco" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "data_emissao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingressos_pkey" PRIMARY KEY ("id_ingresso")
);

-- CreateTable
CREATE TABLE "assentos" (
    "id_assento" SERIAL NOT NULL,
    "id_sala" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "fila" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "assentos_pkey" PRIMARY KEY ("id_assento")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id_pedido" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "data_pedido" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateTable
CREATE TABLE "sessoes" (
    "id_sessao" SERIAL NOT NULL,
    "id_sala" INTEGER NOT NULL,
    "id_filme" INTEGER NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,
    "idioma" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    "preco_base" INTEGER NOT NULL,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id_sessao")
);

-- AddForeignKey
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_id_sessao_fkey" FOREIGN KEY ("id_sessao") REFERENCES "sessoes"("id_sessao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_id_assento_fkey" FOREIGN KEY ("id_assento") REFERENCES "assentos"("id_assento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assentos" ADD CONSTRAINT "assentos_id_sala_fkey" FOREIGN KEY ("id_sala") REFERENCES "salas"("id_sala") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_id_sala_fkey" FOREIGN KEY ("id_sala") REFERENCES "salas"("id_sala") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_id_filme_fkey" FOREIGN KEY ("id_filme") REFERENCES "Filme"("id_filme") ON DELETE RESTRICT ON UPDATE CASCADE;
