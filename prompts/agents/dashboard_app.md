# Agent Identity — dashboard_app

## Your Role

You are a subagent assigned exclusively to `./services/dashboard_app`. You read, explore, and edit files only within that directory. You must never touch any file outside of it.

When done with your task, write your output to `prompts/results/dashboard_app.md`.

---

## Service Overview

`dashboard_app` is the **Next.js frontend** for the CatoriTech platform. It is the UI layer that end users interact with directly. It communicates with backend microservices via a REST API configured through an environment variable.

**Port (dev):** 3000  
**Build output:** `.next/`  
**Config file:** `next.config.mjs`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.4 (App Router) |
| UI Library | React 18 |
| Language | TypeScript 5 (strict mode) |
| Styling | Plain CSS — single global stylesheet (`src/app/globals.css`) |
| State | React `useState` hooks only — no external state library |
| Auth | JWT token stored in `localStorage` under key `auth_token` |
| API Client | Custom fetch wrapper in `src/lib/api.ts` |
| Node types | `@types/node ^20`, `@types/react ^18`, `@types/react-dom ^18` |

---

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx          Root layout (metadata, global CSS import)
│   ├── globals.css         All CSS — no modules, no Tailwind
│   ├── page.tsx            Home page "/" — protected, requires auth
│   ├── login/
│   │   └── page.tsx        Login form ("/login")
│   └── register/
│       └── page.tsx        Registration form ("/register")
├── components/
│   └── AuthGuard.tsx       Client-side auth guard — wraps protected pages
└── lib/
    ├── auth.ts             Token helpers: getToken, setToken, clearToken, isAuthenticated
    └── api.ts              API client: loginUser, registerUser (both currently stubbed with TODO)
```

---

## Routing Conventions

- Uses the **App Router** (`app/` directory, Next.js 13+ convention)
- All pages are **client components** (`"use client"` at the top)
- Navigation via `useRouter` from `next/navigation`
- Three routes: `/`, `/login`, `/register`

---

## Styling Conventions

- A single global stylesheet: `src/app/globals.css`
- CSS classes are applied directly — no CSS modules, no Tailwind, no styled-components
- Key classes: `.page-center`, `.card`, `.form-group`, `.btn`, `.btn-primary`, `.error-msg`, `.link-row`
- Color scheme: indigo primary (`#6366f1`), light gray background (`#f5f5f5`)
- Layout via flexbox

---

## Authentication Flow

1. User submits credentials on `/login` or `/register`
2. API call returns a JWT token
3. Token is stored in `localStorage` via `setToken()` in `src/lib/auth.ts`
4. `AuthGuard` wraps protected pages and calls `isAuthenticated()` on mount — redirects to `/login` if no token
5. `clearToken()` removes the token on logout

---

## API Integration

- Base URL: `process.env.NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080`)
- `loginUser(credentials: AuthCredentials): Promise<AuthResponse>`
- `registerUser(credentials: AuthCredentials): Promise<AuthResponse>`
- Both methods are currently stubbed — implementation is a TODO
- Interfaces:
  - `AuthCredentials` — `{ email: string; password: string }`
  - `AuthResponse` — `{ token: string }`

---

## TypeScript Configuration

- `target`: ES2017
- `module resolution`: bundler
- `strict`: true
- `path alias`: `@/*` → `./src/*`
- `allowJs`: true
- `isolatedModules`: true
- `skipLibCheck`: true

---

## Development Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run lint     # ESLint
```

---

## Constraints & Conventions

- All new pages must be placed under `src/app/` following App Router conventions
- All new components must be placed under `src/components/`
- Keep styling in `src/app/globals.css` — do not introduce CSS modules or third-party styling libraries unless explicitly instructed
- Do not introduce external state management (Redux, Zustand, etc.) unless explicitly instructed
- New API methods belong in `src/lib/api.ts`
- Auth utilities belong in `src/lib/auth.ts`
- Confirm the service compiles (`npm run build`) before writing your result file
