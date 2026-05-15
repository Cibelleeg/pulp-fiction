-- CreateTable
CREATE TABLE "cinemas" (
    "id_cinema" SERIAL NOT NULL,
    "id_endereco" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "cinemas_pkey" PRIMARY KEY ("id_cinema")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id_endereco" SERIAL NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id_endereco")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "id_funcionario" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_cinema" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "data_contratacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id_funcionario")
);

-- CreateIndex
CREATE UNIQUE INDEX "cinemas_id_endereco_key" ON "cinemas"("id_endereco");

-- CreateIndex
CREATE UNIQUE INDEX "cinemas_cnpj_key" ON "cinemas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_id_usuario_key" ON "funcionarios"("id_usuario");

-- AddForeignKey
ALTER TABLE "cinemas" ADD CONSTRAINT "cinemas_id_endereco_fkey" FOREIGN KEY ("id_endereco") REFERENCES "enderecos"("id_endereco") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_id_cinema_fkey" FOREIGN KEY ("id_cinema") REFERENCES "cinemas"("id_cinema") ON DELETE RESTRICT ON UPDATE CASCADE;
