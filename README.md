# serve. — backend

Express + Postgres API for scheduling church volunteers.

## Run locally

```bash
brew install postgresql@17 && brew services start postgresql@17
createdb serve
npm install
npm run db:reset   # build the schema from migrations + seed demo data
npm run dev        # http://localhost:3001
```

## Database migrations

The schema lives in [`migrations/`](migrations) (node-pg-migrate). Never edit an applied migration; add a new one.

| Command | What it does |
|---|---|
| `npm run migrate` | Apply pending migrations (safe on production; Render can run it on deploy) |
| `npm run migrate:down` | Roll back the most recent migration |
| `npm run migrate:create -- add-thing` | Create a new migration file |
| `npm run db:reset` | **Dev only:** roll back everything, re-apply, re-seed (wipes data; refuses when `NODE_ENV=production`) |
| `node migrate.js baseline` | One-time, for a database created before migrations existed: marks the baseline as applied without touching data |

Seeded logins (password is `password` for all):
- admin: `admin@serve.test`
- volunteers: `<first>.<last>@serve.test`, e.g. `sarah.mitchell@serve.test`

Config comes from env vars (see `.env.example`): `DATABASE_URL`, `SECRET_KEY`, `PORT`, `NODE_ENV`.
