# Context - Smart Team Chat

A lightweight real-time team chat application built with React, TypeScript, and Supabase.

The goal of this project was not to build yet another chat application, but to create a simple communication tool that solves a couple of real problems teams face every day:

* Joining a conversation late and struggling to catch up.
* Important questions getting buried in chat.

To address those problems, the application includes:

* Real-time messaging
* Presence tracking
* Typing indicators
* Catch Me Up (conversation summaries)
* Open Question tracking

### Live Demo

https://get-context.netlify.app/

---

# What I Optimized For

Given the scope of the assignment, I intentionally optimized for:

1. Product thinking over feature count
2. Realtime reliability over visual complexity
3. Maintainable architecture over rapid prototyping
4. Solving communication problems over adding chat gimmicks
5. Simplicity over unnecessary abstraction

I believe good engineering is largely about making thoughtful tradeoffs and delivering value with limited resources.

For that reason, the entire application is built using free-tier services and local business logic.

No paid APIs.
No custom backend infrastructure.
No AI services.

Everything runs using React, Supabase Free Tier, and browser-side logic.

---

# Features

### Real-Time Messaging

* Send and receive messages instantly
* Persistent chat history
* Message timestamps
* Auto-scroll support

### Presence Tracking

* View online users
* Live online user count
* Realtime updates when users join or leave

### Typing Indicators

* See when someone is typing
* Automatically disappears after inactivity

### Catch Me Up

Users joining late can quickly understand recent activity.

Instead of relying on external AI services, the application analyzes recent messages locally and generates a lightweight summary containing:

* Active participants
* Discussion topics
* Recent activity
* Open questions

### Open Question Tracking

Questions are automatically detected and tracked.

Examples:

* Can someone review my PR?
* Should we deploy this today?

Questions remain visible until another participant responds.

This helps prevent important discussions from being forgotten.

---

# Technology Choices

## Why React + Vite?

This application is highly interactive and realtime by nature.

The primary concerns are:

* Realtime updates
* Presence
* Typing indicators
* Local state management

Because of that, I chose React with Vite instead of a framework that introduces server-side rendering complexity.

For this use case:

* SEO is not important
* Content is not publicly discoverable
* Users must actively join the application before interacting

Adding SSR would increase complexity and infrastructure requirements without providing meaningful user value.

React + Vite provides:

* Fast startup
* Simple deployment
* Excellent developer experience
* Strong TypeScript support

---

## Why Supabase?

The assignment requires realtime communication, not realtime infrastructure.

Supabase provides:

* Postgres database
* Realtime subscriptions
* Presence channels
* Generous free tier

This allowed me to spend more time solving user problems and less time building websocket infrastructure.

For a small team chat application, this felt like the most pragmatic tradeoff.

---

# Product Decisions

## Single Shared Room

I intentionally chose a single-room experience.

Supporting multiple rooms introduces:

* Room management
* Membership logic
* Additional routing
* More complex data models

For this assignment, I wanted to focus on communication quality rather than workspace management.

---

## No Authentication

Users simply choose a display name and start chatting.

This keeps onboarding friction extremely low.

Authentication can be introduced later without significantly changing the architecture.

---

## Persistent History

Messages are stored in Supabase so conversations survive page refreshes.

This makes the application feel more realistic and enables late joiners to catch up on context.

---

## Local Summaries Instead of AI

Many modern applications solve this problem using LLMs.

I intentionally chose not to.

The objective was to create a useful experience without introducing:

* Paid APIs
* Additional infrastructure
* Ongoing costs

The summary feature uses local heuristics and message analysis.

While less sophisticated than an AI-generated summary, it is free, predictable, and sufficient for the scale of this application.

---

# Architecture

The application follows a feature-first architecture with clear separation between UI, business logic, and data access.

```text
src/
├── app/
├── core/
├── features/
├── shared/
└── assets/
```

## app

Application bootstrap and configuration.

Examples:

* Routes
* Providers
* Initialization

---

## core

Shared business logic.

Contains:

* API clients
* Repositories
* Services
* Utilities
* Models
* Constants

Repositories are the only layer allowed to communicate directly with Supabase.

Services contain business rules such as:

* Question detection
* Summary generation
* Presence handling

---

## features

Each feature owns:

* Views
* Components
* Controller hooks
* Feature-specific models

Examples:

```text
features/
├── chat/
├── summary/
├── reminders/
└── presence/
```

This keeps related functionality together and allows features to evolve independently.

---

## shared

Reusable UI components.

Examples:

* Button
* Input
* Modal
* Loader
* Empty State

Feature-specific components remain within their respective feature modules.

---

# End-to-End User Flow

### Joining

1. Open the application.
2. Enter a display name.
3. Join the shared chat room.

### Messaging

1. Type a message.
2. Message is stored in Supabase.
3. Realtime subscriptions distribute updates.
4. Other connected users see the message immediately.

### Presence

1. User joins the room.
2. Presence state updates.
3. Online users update for everyone.

### Typing Indicators

1. User starts typing.
2. Presence state is updated.
3. Other users see a typing indicator.
4. Indicator disappears after inactivity.

### Catch Me Up

1. User joins after some time away.
2. User clicks "Catch Me Up".
3. Recent messages are analyzed locally.
4. Summary is displayed instantly.

### Open Questions

1. A user asks a question.
2. The question is detected automatically.
3. It appears in the Open Questions panel.
4. Another participant responds.
5. The question is marked as answered.

---

# Getting Started

## Prerequisites

* Node.js 20+
* npm
* Supabase account

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

---

## Supabase Setup

Create a free Supabase project.

Run the SQL schema provided in:

```text
supabase/schema.sql
```

Enable Realtime for:

* messages
* questions

Copy:

* Project URL
* Anon Key

from:

Settings → API

---

## Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Run Locally

```bash
npm run dev
```

Application will be available at:

```text
http://localhost:5173
```

---

## Production Build

```bash
npm run build
npm run preview
```

The generated `dist` folder can be deployed to:

* Netlify
* Vercel
* GitHub Pages

or any static hosting provider.

---

# Future Improvements

If I were continuing this project, I would likely prioritize:

1. Multiple chat rooms
2. Threaded replies
3. User authentication
4. Mentions and notifications
5. Message search
6. Offline support
7. Smarter summaries
8. Reactions and lightweight collaboration features

The current architecture was intentionally designed so these features can be added without major restructuring.

---

# Final Thoughts

This project is intentionally small.

Rather than maximizing feature count, I focused on building a reliable realtime experience, making clear architectural decisions, and solving a few communication problems that frequently appear in team chats.

In practice, many engineering decisions are tradeoffs between complexity, cost, maintainability, and user value.

This implementation reflects the choices I would make if asked to deliver a useful solution quickly while staying within a limited budget and operating entirely on free-tier infrastructure.
