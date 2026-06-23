# Smart Team Chat

A lightweight real-time team chat application built with React, TypeScript, and Supabase. Designed for small teams who need fast communication with built-in catch-up summaries and open question tracking.

## Features

- **Real-time messaging** — Send and receive messages instantly with persistent history
- **Presence tracking** — See who's online in the shared room
- **Typing indicators** — Know when teammates are composing a message
- **Catch Me Up** — Local conversation summary for users joining late (no AI APIs)
- **Open Question Reminders** — Automatically detect and track unanswered questions

## Quick Start

### 1. Clone and install

```bash
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Open the SQL Editor and run the schema from [`supabase/schema.sql`](supabase/schema.sql)
3. Enable Realtime for `messages` and `questions` tables (included in schema)
4. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), enter a display name, and join the chat.

### 5. Build for production

```bash
npm run build
npm run preview
```

Deploy the `dist` folder to any static host (Vercel, Netlify, GitHub Pages).

---

## Product Decisions

### Single shared room

Small teams often work in one channel during early stages. A single room reduces setup friction and keeps the focus on communication patterns rather than room management.

### No authentication

Display names are stored locally. This keeps onboarding instant — open the app, type your name, start chatting. Authentication can be added later without changing the core architecture.

### Persistent message history

Messages are stored in Supabase Postgres so conversations survive page refreshes and new joiners can scroll through history before using "Catch Me Up."

### Conversation summary (Catch Me Up)

Late joiners struggle to catch up. Instead of requiring an AI API, we analyze the last 50 messages locally: extract participants, detect topics via keyword seeds, summarize activity per user, and surface open questions. It's heuristic, not LLM-quality — but it's useful and free.

### Question reminders

Questions get buried in fast-moving chats. Messages containing `?` or starting with question words (can, should, would, etc.) are tracked. A question is marked answered when another user sends a subsequent message — a simple heuristic that works well for small teams.

---

## Architecture Decisions

### Feature-first architecture

Code is organized by feature (`chat`, `presence`, `summary`, `reminders`) with shared UI in `shared/`. Each feature owns its view, controller hooks, and feature-specific components.

```
src/
├── app/           # Routes, providers, bootstrap
├── core/          # API, repositories, services, models, utils
├── features/      # Feature modules (view + hooks + components)
└── shared/        # Reusable UI (Button, Modal, Loader, etc.)
```

### Service and repository separation

- **Repositories** — Data access only; the only layer that talks to Supabase
- **Services** — Business logic (question detection, answer heuristics, summarization)
- **Controller hooks** — Orchestrate services, manage screen state, transform domain → UI models
- **Views** — Presentational; receive data from controllers

Views never call repositories directly.

### UI copy centralization

All user-facing strings live in `core/constants/ui-copy.json`, imported via `ui-copy.ts`. This supports future localization and keeps copy changes out of component logic.

---

## Tradeoffs

### Why Supabase instead of custom WebSocket infrastructure?

**Pros:**
- Faster development — realtime, Postgres, and REST in one free tier
- Built-in presence and broadcast channels
- No server to deploy or maintain
- Message persistence comes for free

**Cons:**
- Vendor dependency on Supabase
- Less control over realtime protocol and scaling
- RLS policies required for any future auth model

For a take-home assignment and small-team use case, the tradeoff strongly favors Supabase.

---

## Future Improvements

- **Multiple rooms** — Channel-based architecture with room switching
- **Threaded replies** — Reply-to-message with nested UI
- **Authentication** — Supabase Auth with proper user profiles
- **Better summarization** — Optional AI integration behind a feature flag
- **Notification system** — Browser push for mentions and open questions
- **Message reactions** — Emoji reactions with realtime sync

---

## Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Frontend | React 19, TypeScript, Vite |
| Styling  | TailwindCSS       |
| Backend  | Supabase (Postgres + Realtime) |
| Hosting  | Any static host   |

---

## License

MIT
