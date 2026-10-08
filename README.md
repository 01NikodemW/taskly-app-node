# taskly-node

## Setup

```sh
cp .env.example .env
```

## Docker

```sh
docker compose up --build -d --wait
```

Application: http://localhost:8080. API: http://localhost:8000/docs.

```sh
docker compose down
```

## Frontend

Installation:

```sh
cd frontend
npm ci
```

Development — http://localhost:5173:

```sh
npm run dev
```

Storybook — http://localhost:6006:

```sh
npm run storybook
```

Tests:

```sh
npm test
```

Coverage — `frontend/coverage/index.html`:

```sh
npm run test:coverage
```

## Backend (TypeScript + Node.js + Express)

Requires Node.js >=22.12 and PostgreSQL. From the repository root:

```sh
cp .env.example .env # if not already configured
cd backend
npm ci
```

Development (start PostgreSQL from the repository root first):

```sh
docker compose up -d --wait postgres
cd backend
npm run dev
```

Production: `npm run build`, then `npm start` from `backend`. API: http://localhost:8000/api/todos.
Swagger UI: http://localhost:8000/docs. OpenAPI: http://localhost:8000/openapi.json.
The server reads the root `.env`; `DATABASE_URL` overrides the individual PostgreSQL
settings. `API_PORT` defaults to 8000. Docker keeps the internal port at 8000.
The existing `todos` table and data remain compatible; no volume reset is needed.

### Tests and coverage

Run from `backend` (no PostgreSQL or `.env` required):

```sh
npm run typecheck     # TypeScript validation
npm run build         # compile to dist/
npm test              # one run
npm run test:watch    # watch mode
npm run test:coverage # generate the coverage report
```
