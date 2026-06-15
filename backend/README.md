# Backend

Standalone Express + TypeScript server for the Deepframe backend.

## Scripts

Run these from the `backend` folder:

```bash
npm install
npm run db:generate
npm run build
npm run start
```

The server reads `PORT` from the environment and defaults to `4000`.

## Database

This backend uses PostgreSQL through Prisma ORM.

1. Copy `.env.example` to `.env` inside the `backend` folder.
2. Update `DATABASE_URL` for your local or deployed Postgres database.
3. Push the schema during early development:

```bash
npm run db:push
```

For migration-based development, use:

```bash
npm run db:migrate
```

## Endpoints

- `GET /` - API status
