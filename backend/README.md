# wordle-backend

A GraphQL clone of the Wordle game

## Database requirements

You must be running a local PostgreSQL DB on port `5432`.

## Getting started

Copy the environment template and update the values to match your local DB:

```bash
cp .env.template .env
```

Migrate the DB:

```bash
npx prisma migrate dev
```

Run the app:

```
npm i
npm run dev
```
