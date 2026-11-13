# serve. — backend

Express + Postgres API for scheduling church volunteers.

## Run locally

```bash
brew install postgresql@17 && brew services start postgresql@17
createdb serve
npm install
npm run db:reset   # create tables + seed demo data
npm run dev        # http://localhost:3001
```

Seeded logins (password is `password` for all):
- admin: `admin@serve.test`
- volunteers: `<first>.<last>@serve.test`, e.g. `sarah.mitchell@serve.test`

Config comes from env vars (see `.env.example`): `DATABASE_URL`, `SECRET_KEY`, `PORT`, `NODE_ENV`.
