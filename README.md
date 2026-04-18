# Memory Assist Bot

A small demo app (FastAPI backend + React + Vite frontend) for a personal "memory" assistant.

## Summary

- Backend: `backend/main.py` — FastAPI service exposing chat and conversation endpoints, plus demo endpoints that return static memories/people/places/birthdays. Conversations and messages are persisted to `backend/data.db` (SQLite) created by the app.
- Frontend: `frontend/` — Vite + React application (see `frontend/src/App.tsx`) that drives the UI: chat, overview, feeds, lists, and navigation. Key components live in `frontend/src/components/` (e.g. `ChatView.tsx`, `Sidebar.tsx`).

## Notable Endpoints

- `POST /chat` — Accepts `{ message, conversation_id? }`, saves user + assistant messages to the DB, and returns a simple demo reply.
- `POST /conversations` — Create a new conversation.
- `GET /conversations` — List conversations.
- `GET /conversations/{id}/messages` — Get messages for a conversation.
- `POST /conversations/{id}/messages` — Append a message (role must be `user` or `assistant`).
- Demo data endpoints: `GET /memories`, `GET /people`, `GET /places`, `GET /birthdays` (return static data for the UI).

## How to run (local dev)

1. Backend (FastAPI)

```powershell
# From repository root
python backend/main.py

# OR using uvicorn directly (hot reload)
uvicorn backend.main:app --reload --port 8001
```

The backend will be available at http://localhost:8001 and API docs at http://localhost:8001/docs.

2. Frontend (Vite + React)

```powershell
cd frontend
npm install
npm run dev
```

By default the frontend expects the backend at `http://localhost:8001` (see `frontend/src/utils/constants.ts`).

## DB

- SQLite DB path: `backend/data.db` (auto-created by the app via `ensure_db()`).

## Notes & Limitations

- The `/chat` endpoint is a simple rule-based/demo reply (not an LLM) and returns canned messages. Some endpoints return hard-coded demo data for UI development.
- CORS is enabled for common local ports in `backend/main.py`. Update `allow_origins` when deploying to production.

## Troubleshooting

- If the frontend cannot reach the backend, confirm the backend is running on port `8001` and that `BACKEND_URL` in the frontend points to the correct URL.
- If ports are in use, change the port when starting `uvicorn` or Vite.

---

If you want, I can start both servers now and verify the app is reachable locally.
