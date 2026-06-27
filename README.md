# API Alarmes Água

API REST NestJS 11 (Fastify) para gestão de produtos geoambientais, sensores satelitais e detecções do SIG Alarmes Água.

## Pré-requisitos

- Node.js 22+
- Acesso de rede ao PostgreSQL configurado no `.env`
- Docker (opcional)

## Configuração

```bash
cp .env.example .env
```

Edite `.env` com os valores do seu ambiente (veja `.env.example`):

- `DATABASE_URL` — connection string do PostgreSQL (inclua `?schema=agua` se usar o schema `agua`)
- `JWT_ACCESS_SECRET` — mínimo 16 caracteres
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — credenciais do usuário admin criado pelo seed

**Nunca commite o arquivo `.env`** nem credenciais reais no repositório.

Se o schema `agua` não existir no banco:

```sql
CREATE SCHEMA IF NOT EXISTS agua;
```

**Banco com tabelas legadas:** o schema `agua` pode conter tabelas antigas de outros sistemas. Não use `prisma db push` nem `migrate reset` — prefira `prisma migrate deploy`. A migration inicial cria somente as tabelas da API.

**UUID:** a migration habilita a extensão `uuid-ossp` e usa `public.uuid_generate_v4()` como default dos IDs. Requer permissão para `CREATE EXTENSION` no banco (uma vez).

## Desenvolvimento local

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run start:dev
```

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run start:dev` | API com hot-reload |
| `npm run build` | Compila TypeScript |
| `npm run lint` | Verificação de tipos (`tsc --noEmit`) |
| `npm run db:generate` | Gera client Prisma |
| `npm run db:migrate` | Migrations em dev |
| `npm run db:seed` | Seed do usuário admin |
| `npm run docker:up` | Sobe API via Docker Compose |

## Docker

```bash
docker compose up --build
```

O entrypoint executa `prisma migrate deploy` antes de iniciar a API (salvo `SKIP_DB_MIGRATE=1`).

## Endpoints — Autenticação

| Método | Rota | Autenticação |
|--------|------|--------------|
| POST | `/auth/login` | Não |
| POST | `/auth/refresh` | Não |
| POST | `/auth/logout` | Não |
| GET | `/auth/me` | Bearer JWT |
| GET | `/health` | Não |

## Endpoints — Produtos

| Método | Rota | Autenticação |
|--------|------|--------------|
| POST | `/products` | Bearer JWT |
| GET | `/products` | Bearer JWT |
| GET | `/products/:productId` | Bearer JWT |
| PUT | `/products/:productId` | Bearer JWT |
| DELETE | `/products/:productId` | Bearer JWT |

`DELETE` realiza soft delete do produto e dos sensores/detecções vinculados.

## Endpoints — Sensores

| Método | Rota | Autenticação |
|--------|------|--------------|
| POST | `/sensors` | Bearer JWT |
| GET | `/sensors` | Bearer JWT |
| GET | `/sensors/:sensorId` | Bearer JWT |
| PUT | `/sensors/:sensorId` | Bearer JWT |
| DELETE | `/sensors/:sensorId` | Bearer JWT |
| GET | `/products/:productId/sensors` | Bearer JWT |

`DELETE` em sensor realiza soft delete das detecções vinculadas. Respostas incluem `_count.logs` (detecções ativas).

## OpenAPI (Swagger)

Com a API em execução:

| URL | Descrição |
|-----|-----------|
| [http://localhost:3000/docs](http://localhost:3000/docs) | Interface Swagger UI |
| [http://localhost:3000/docs/json](http://localhost:3000/docs/json) | Especificação OpenAPI (JSON) |

Novos controllers e DTOs entram na documentação automaticamente (plugin do CLI). Rotas públicas estão em `src/config/swagger.config.ts`; as demais exigem Bearer JWT na interface.

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<seu-email>","password":"<sua-senha>"}'
```

### Perfil do usuário autenticado

```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

## Estrutura

- `prisma/alarmes-agua/` — schema Prisma (PostgreSQL, schema `agua`)
- `src/modules/auth/` — autenticação JWT
- `src/modules/products/` — CRUD de produtos geoambientais
- `src/modules/sensors/` — CRUD de sensores satelitais
- `src/modules/logs|users/` — stubs (fases futuras)
