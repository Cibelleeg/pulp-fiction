# Pulp Fiction

Estrutura inicial de backend para um sistema de cinema usando Node.js, TypeScript, Prisma e PostgreSQL.

No estado atual, o repositório concentra a modelagem do banco, a configuração do Prisma e a infraestrutura local com Docker. Nenhuma camada adiconal foi configurada ainda.

## Stack

- Node.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker Compose

## Modelos do banco

O schema atual contem as entidades:

- `Cinema`
- `Endereco`
- `Usuario`
- `Funcionario`

As migrations ficam em `prisma/migrations` e o schema principal esta em `prisma/schema.prisma`.

## Requisitos

- Node.js 20 ou superior
- npm
- Docker e Docker Compose

## Como rodar localmente

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

3. Suba o banco PostgreSQL:

```bash
docker compose up -d
```

4. Aplique as migrations:

```bash
npm run prisma:migrate
```

5. Se quiser inspecionar os dados no navegador:

```bash
npm run prisma:studio
```

## Variaveis de ambiente

Exemplo usado no desenvolvimento local:

```env
DATABASE_URL="postgresql://cinema_user:123456789@localhost:5432/cinema_db?schema=public"
PORT=3333
```

## Banco local

O `docker-compose.yml` sobe um PostgreSQL 16 com os seguintes dados para desenvolvimento:

- host: `localhost`
- port: `5432`
- database: `cinema_db`
- user: `cinema_user`

## Observacoes

- O arquivo `.env` esta ignorado no Git e nao deve ser versionado.
- No Prisma 7, a URL do banco fica centralizada em `prisma.config.ts`.
- Se quiser recriar o banco do zero em ambiente local, remova o volume Docker antes de subir novamente.
