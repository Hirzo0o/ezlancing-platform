# Ezlancing — Sprint 0 starter

This starter includes a branded landing-page shell, a basic API health endpoint and a Prisma/PostgreSQL schema. It **does not** yet include working auth, messaging, Arabic localization, real payments, escrow or the full marketplace.

## Prerequisites
Node.js 22+, npm, Docker Desktop with WSL integration (if on WSL).

## Run locally
```bash
docker compose up -d
npm ci
npx prisma migrate dev --name init
npm run dev
```
Open http://localhost:3000 and http://localhost:3000/api/health.

## Validate
```bash
npx prisma validate
npm run lint
npx tsc --noEmit
npm run build
```

## Security
The database credentials are only for local development. Replace them for any deployed environment. Do not expose database ports publicly.
