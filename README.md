# Task Manager (MERN)

A simple task manager: create, edit, complete and delete tasks, with search and status filtering.

**Stack:** React (Vite) · Node/Express · MongoDB (Atlas) + Mongoose · Jest/Supertest

## Run locally
```bash
# API
cd server && cp .env.example .env   # fill in MONGODB_URI
npm install && npm run dev          # http://localhost:5000

# Client (second terminal)
cd client && npm install && npm run dev   # http://localhost:5173 (proxies /api to :5000)

# Tests (use a separate `taskmanager_test` database, dropped after the run)
cd server && npm test
```
If `npm install` hangs on Node 20, run it with `NODE_OPTIONS=--no-network-family-autoselection`.

## API
| Method | Path | Notes |
|---|---|---|
| GET | `/api/tasks?status=todo\|done&q=text` | newest first |
| POST | `/api/tasks` | `title` required (<=100 chars) |
| PATCH | `/api/tasks/:id` | partial update |
| DELETE | `/api/tasks/:id` | 204 on success |

Task fields: `title`, `description`, `status` (todo/done), `priority` (low/medium/high), `dueDate`.

## Deployment
- API: Render (`render.yaml`), set `MONGODB_URI` and `CLIENT_ORIGIN` (the client URL). Allow the host in Atlas Network Access.
- Client: Vercel/Netlify, root `client`, build `npm run build`, output `dist`, env `VITE_API_URL=<api-url>/api`.

## Assessment answers
See `PLAN.md` for the three key decisions, three features not built, and the one limitation.
