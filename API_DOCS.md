# API Reference — Pulp Fiction Backend

## Autenticação

A API usa **JWT Bearer Token**. Quase todas as rotas exigem o header:

```
Authorization: Bearer <token>
```

O token é obtido via login e deve ser enviado em todas as requisições autenticadas.

---

## Endpoints

### `POST /auth/login` — Sem autenticação

Faz login e retorna o token JWT.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Resposta `200`:**
```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

---

### Usuários `/users`

| Método | Rota | Auth | Role |
|--------|------|------|------|
| `POST` | `/users` | Não | — |
| `GET` | `/users` | Sim | ADMIN |
| `GET` | `/users/:id` | Sim | ADMIN |
| `PATCH` | `/users/:id` | Sim | Próprio usuário ou ADMIN |
| `DELETE` | `/users/:id` | Sim | ADMIN |

**POST `/users` — criar conta:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "cpf": "12345678900",
  "phoneNumber": "11999999999",
  "birthDate": "1990-05-20"
}
```

**PATCH `/users/:id` — atualizar (campos opcionais):**
```json
{
  "name": "João S.",
  "phoneNumber": "11988888888",
  "birthDate": "1990-05-20"
}
```

> ADMIN também pode enviar `"role": "ADMIN"` ou `"role": "USER"` para alterar o papel.

---

### Cinemas `/cinemas` — todas as rotas requerem autenticação

| Método | Rota | Role extra |
|--------|------|------------|
| `GET` | `/cinemas` | — |
| `GET` | `/cinemas/:id` | — |
| `POST` | `/cinemas` | ADMIN |
| `PATCH` | `/cinemas/:id` | ADMIN |
| `DELETE` | `/cinemas/:id` | ADMIN |

**POST `/cinemas` — criar cinema:**
```json
{
  "name": "Cine Pulp Fiction",
  "cnpj": "12345678000100",
  "phoneNumber": "1133334444",
  "email": "cine@email.com",
  "address": {
    "logradouro": "Rua das Flores",
    "numero": "100",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01001000"
  }
}
```

---

### Filmes `/movies` — todas as rotas requerem autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/movies` | Criar filme |
| `GET` | `/movies` | Listar todos |
| `GET` | `/movies/:id` | Buscar por ID |
| `PUT` | `/movies/:id` | Atualizar completo |
| `PATCH` | `/movies/:id` | Atualizar parcial |
| `DELETE` | `/movies/:id` | Deletar |

**POST `/movies` — todos os campos são obrigatórios:**
```json
{
  "title": "Pulp Fiction",
  "synopsis": "Histórias entrelaçadas...",
  "duration": 154,
  "ageRating": 18,
  "genre": "Crime",
  "releaseDate": "1994-10-14"
}
```

---

### Produtos `/products` — todas as rotas requerem autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/products` | Listar todos |
| `GET` | `/products/:id` | Buscar por ID |
| `POST` | `/products` | Criar produto |
| `PUT` | `/products/:id` | Atualizar completo |
| `PATCH` | `/products/:id` | Atualizar parcial |
| `DELETE` | `/products/:id` | Deletar |

**POST `/products` — todos os campos são obrigatórios:**
```json
{
  "name": "Pipoca Grande",
  "description": "Pipoca salgada 1L",
  "price": 18.50,
  "stock": 100,
  "category": "Alimentos"
}
```

---

## Códigos de status

| Status | Significado |
|--------|-------------|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `204` | Deletado (sem body na resposta) |
| `400` | Dados inválidos / campo faltando |
| `401` | Token ausente ou inválido |
| `403` | Sem permissão (role insuficiente) |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |
