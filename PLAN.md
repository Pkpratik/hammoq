# Assessment notes (edit into your own words before recording)

## 3 key decisions
1. **Server-side validation and field whitelisting.** The API validates title length, status and priority with Mongoose and only accepts known fields, so the UI is not the only line of defence.
2. **Optimistic toggle with rollback.** Checking a task updates the UI immediately and reverts with an error banner if the request fails, so it feels instant but stays correct.
3. **MongoDB behind a thin REST API with a Vite dev proxy.** Same-origin in dev (no CORS pain), explicit `CLIENT_ORIGIN` allowlist in prod. Tests run against a separate database so real data is never touched.

## 3 features deliberately not built
1. **Authentication / per-user lists:** out of scope for a 24h time-box and adds security surface; one shared list proves the core CRUD.
2. **Drag-and-drop ordering / Kanban board:** nice-to-have, not core to "create and manage tasks".
3. **Reminders / notifications:** needs background jobs and delivery infrastructure that doesn't fit the time-box.

## 1 limitation (fix with one more day)
**No pagination:** `GET /api/tasks` returns every task, so it slows down with thousands of tasks. I would add cursor-based pagination (indexed on `createdAt`) and infinite scroll in the UI.
