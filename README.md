# Pulp Fiction

Estrutura inicial de backend para um sistema de cinema usando Node.js, TypeScript, Prisma e PostgreSQL.

No estado atual, o repositorio concentra a modelagem do banco, a configuracao do Prisma e a infraestrutura local com Docker. Nenhuma camada adicional foi configurada ainda.

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

## Boas praticas com Git

Fluxo recomendado para criar uma branch e subir o trabalho para o remoto:

1. Atualize a branch principal antes de comecar:

```bash
git checkout main
git pull origin main
```

2. Crie uma branch descritiva para a tarefa:

```bash
git checkout -b feat/cadastro-funcionario
```

Sugestao de convencao de nomes:

- `feat/...` para nova funcionalidade
- `fix/...` para correcao de bug
- `docs/...` para documentacao
- `chore/...` para manutencao

3. Faca as alteracoes e revise o que mudou:

```bash
git status
```

4. Adicione apenas os arquivos relacionados ao trabalho:

```bash
git add README.md prisma/schema.prisma
```

5. Crie um commit com mensagem objetiva:

```bash
git commit -m "docs: adiciona fluxo de branch e push"
```

6. Envie a branch para o remoto pela primeira vez:

```bash
git push -u origin feat/cadastro-funcionario
```

7. Abra um Pull Request da sua branch para `main`.

Boas praticas para o dia a dia:

- Evite trabalhar direto na `main`.
- Prefira commits pequenos e com escopo claro.
- Revise o `git status` antes de usar `git add`.
- Rode as validacoes do projeto antes de subir a branch.
- Use `
git push` nas proximas atualizacoes, depois do primeiro `git push -u`.

## Observacoes

- O arquivo `.env` esta ignorado no Git e nao deve ser versionado.
- No Prisma 7, a URL do banco fica centralizada em `prisma.config.ts`.
- Se quiser recriar o banco do zero em ambiente local, remova o volume Docker antes de subir novamente.
