# LLM Orchestrator — Player Management Platform

A multi-service web application for player registration, authentication, and reporting, developed using an **LLM-orchestrated multi-agent workflow** with Claude Code.

---

## Architecture Overview

```
                        ┌─────────────────────┐
                        │      Browser        │
                        └─────────┬───────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │    dashboard_app         │
                    │    Next.js 16 · TS       │
                    │    Port 3000             │
                    └────────┬────────┬────────┘
                             │        │
               REST/JSON     │        │  REST/JSON
               (Auth &       │        │  (Reports &
               Profile)      │        │   Admin data)
                             ▼        ▼
          ┌──────────────────────┐  ┌──────────────────────┐
          │  player_management   │  │     reports_ms        │
          │        _ms           │◄─┤  Quarkus 3 · Java 21  │
          │  Quarkus 3 · Java 21 │  │  Port 8082            │
          │  Port 8081           │  └──────────────────────┘
          │  H2 in-memory DB     │    (calls player_ms
          └──────────────────────┘     for raw player data)
```

All communication is **synchronous REST (HTTP/JSON)**. JWT Bearer tokens are used for authentication across all services.

---

## Microservices

### 1. `dashboard_app` — Next.js Frontend

The user-facing single-page application.

| Property | Value |
|----------|-------|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5 |
| UI | React 18 |
| Styling | Global CSS (no Tailwind/CSS Modules) |
| Charts | Recharts 3 |
| Auth | JWT stored in `localStorage` |
| Dev port | `3000` |

**Pages & routes:**

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Username/password login |
| `/register` | Public | Player registration with profile fields |
| `/` | Protected | Home dashboard with profile stats |
| `/account` | Protected | Edit own profile |
| `/admin` | Admin only | User management table + charts |

**Environment variables:**

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8081` | Player Management MS base URL |
| `NEXT_PUBLIC_REPORTS_URL` | `http://localhost:8082` | Reports MS base URL |

---

### 2. `player_management_ms` — Auth & Player Service

Handles all authentication, player registration, and player CRUD operations.

| Property | Value |
|----------|-------|
| Framework | Quarkus 3.9.4 |
| Language | Java 21 |
| REST | RESTEasy Reactive (JAX-RS) |
| ORM | Hibernate Panache |
| Database | H2 in-memory |
| Security | SmallRye JWT |
| Dev port | `8081` |

**REST API:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/register` | None | Register a new player, returns JWT |
| `POST` | `/api/v1/auth/login` | None | Login, returns JWT |
| `GET` | `/api/v1/players/me` | JWT (player) | Get own profile |
| `PUT` | `/api/v1/players/me` | JWT (player) | Update own profile |
| `GET` | `/api/v1/admin/players` | JWT (admin) | List all players |
| `PUT` | `/api/v1/admin/players/{id}/suspend` | JWT (admin) | Suspend a player |
| `PUT` | `/api/v1/admin/players/{id}/activate` | JWT (admin) | Reactivate a player |
| `DELETE` | `/api/v1/admin/players/{id}` | JWT (admin) | Delete a player |
| `PUT` | `/api/v1/admin/players/{id}` | JWT (admin) | Admin update player |

**Player entity fields:** `username`, `email`, `passwordHash` (SHA-256 + salt), `name`, `surname`, `birthday`, `mobilePhone`, `sex` (enum), `role` (`PLAYER`/`ADMIN`), `status` (`ACTIVE`/`SUSPENDED`), `createdAt`, `updatedAt`.

**Environment variables:**

| Variable | Default | Purpose |
|----------|---------|---------|
| `JWT_ISSUER` | `https://example.com/player-management` | JWT issuer claim |

---

### 3. `reports_ms` — Reporting Service

A stateless aggregation service that composes player data into reports for the admin dashboard.

| Property | Value |
|----------|-------|
| Framework | Quarkus 3.9.4 |
| Language | Java 21 |
| REST | RESTEasy Reactive (JAX-RS) |
| REST Client | Quarkus REST Client Reactive |
| Dev port | `8082` |

Fetches raw player data from `player_management_ms` on demand via an internal REST client, then computes aggregates (gender breakdown, registration trends).

**REST API:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/reports/admin/users` | JWT (admin) | All players + gender breakdown |
| `GET` | `/api/reports/admin/registrations/trend` | JWT (admin) | Daily registration trend data |

**Environment variables:**

| Variable | Default | Purpose |
|----------|---------|---------|
| `quarkus.rest-client.player-management.url` | `http://localhost:8081` | URL of Player Management MS |

---

## Service Communication

| Connection | Protocol | Auth forwarding |
|-----------|----------|-----------------|
| Browser → `dashboard_app` | HTTP | N/A |
| `dashboard_app` → `player_management_ms` | REST/JSON | JWT in `Authorization` header |
| `dashboard_app` → `reports_ms` | REST/JSON | JWT in `Authorization` header |
| `reports_ms` → `player_management_ms` | REST/JSON | JWT forwarded from original request |

There is no message broker or shared database — all inter-service calls are synchronous HTTP.

---

## Dev Credentials

The following seed account is created automatically in `dev` profile:

| Field | Value |
|-------|-------|
| Username | `admin_user` |
| Password | `password123` |
| Email | `admin@example.com` |
| Role | Admin |

---

## Running the Services

### Prerequisites

- Node.js 18+ and npm
- Java 21+
- Maven (or use the included `mvnw` wrapper)

### `player_management_ms` (start first)

```bash
cd services/player_management_ms
./mvnw quarkus:dev
# Runs on http://localhost:8081
```

### `reports_ms`

```bash
cd services/reports_ms
./mvnw quarkus:dev
# Runs on http://localhost:8082
```

### `dashboard_app`

```bash
cd services/dashboard_app
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## LLM Orchestrator

This repository is designed to be developed using a **multi-agent Claude Code workflow**. A main orchestrator agent coordinates service-specific subagents, each scoped to a single microservice directory.

### How to start the orchestrator

```bash
claude --append-system-prompt "$(cat system-prompt.md)"
```

### How it works

```
┌──────────────────────────────────────────────────────────────┐
│                    Main Orchestrator Agent                   │
│  - Reads system-prompt.md rules                              │
│  - Uses MCP tool to inspect service API contracts            │
│  - Writes task prompts to prompts/tasks/<service>.md         │
│  - Spawns subagents scoped to one service directory          │
│  - Reads results from prompts/results/<service>.md           │
└──────────┬──────────────────┬───────────────────┬────────────┘
           │                  │                   │
    ALLOWED_DIR=              │            ALLOWED_DIR=
    ./services/               │            ./services/
    dashboard_app             │            reports_ms
           │           ALLOWED_DIR=               │
           ▼           ./services/                ▼
  ┌────────────────┐   player_management  ┌────────────────┐
  │ Frontend Agent │         _ms          │  Reports Agent │
  └────────────────┘           │          └────────────────┘
                               ▼
                     ┌─────────────────┐
                     │  Player MS Agent│
                     └─────────────────┘
```

- Each subagent is isolated to its service directory via the `ALLOWED_DIR` environment variable enforced by hooks in `.claude/hooks/`.
- Service boundary violations are blocked at the hook level — subagents cannot read or modify other services' files.
- The `prompts/agents/` directory contains identity files for each subagent describing its tech stack, conventions, and constraints.

### Notice
The orchestrator has support for an MCP that allows to search the available endpoints of the microservices.
However, for this release, the MCP is not yet active for this repository.