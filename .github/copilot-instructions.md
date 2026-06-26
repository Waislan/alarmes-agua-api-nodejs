# Copilot instructions — alarmes-agua-api-nodejs

REST API for the Alarmes Água GIS (NestJS 11, Fastify, Prisma 6, PostgreSQL schema `agua`). Business error messages in Portuguese; commit messages in English.

## Commit messages

When suggesting or generating Git commit messages, follow **Conventional Commits**.

### Format

```
<type>: <subject>

[optional body]
```

Omit scope unless it clearly improves clarity (`feat: adds ...`, not `feat(auth): ...`).

### Types

| Type | Use when |
|------|----------|
| `feat` | New feature or endpoint |
| `fix` | Bug fix |
| `refactor` | Code change without behavior change |
| `chore` | Tooling, deps, configs |
| `docs` | README, comments, plans |
| `build` | Docker, CI, build scripts |
| `test` | Tests only |
| `perf` | Performance improvement |

### Rules

- **Language:** English only.
- **Subject verb:** always **third person** (`adds`, `fixes`, `updates`, `removes`, `configures`) — not imperative (`add`, `fix`).
- **Case:** lowercase after the colon, no trailing period.
- **Max 72 characters** for the subject line.
- **Body** (optional): short bullet list in English, third person; explain *why*, not a file list.
- Do **not** mention `.env`, passwords, or credentials.
- Avoid vague subjects: `update`, `changes`, `fix stuff`, `wip`.

### Good examples

```
feat: adds initial structure of API with NestJS and Prisma

feat: adds JWT authentication with opaque refresh tokens

fix: qualifies uuid_generate_v4 with public schema for agua tables

refactor: migrates IDs to native UUID and VARCHAR text columns

chore: configures Docker Compose with API-only service

docs: documents remote database setup and auth endpoints
```

### Bad examples (do not use)

```
feat(init): adicionar estrutura inicial da API com NestJS e Prisma
feat(auth): add JWT login
fix: fixed prisma migration
```
