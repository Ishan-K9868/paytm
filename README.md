# PayAssist

PayAssist is a two-surface application:

- Marketing surface at `/`
- Merchant operations dashboard at `/auth/*` and `/app/*`

It combines payment operations workflows (verification, reconciliation, disputes), AI copilot experiences, and advanced AI modules in a single UI system.

## 1) System Overview

### High-level architecture

```text
┌──────────────────────────────────────────────────────────────────────┐
│                           Frontend (Vite)                           │
│  React 19 + TypeScript + React Router + Zustand + React Query       │
│                                                                      │
│  / (landing)                                                         │
│  /auth/* (login/signup/onboarding)                                   │
│  /app/* (merchant dashboard modules)                                 │
│                                                                      │
│  UI modules call:                                                    │
│   - geminiClient  -> POST /api/ai/*                                 │
│   - paytmClient   -> local simulation helper (demo data)            │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ /api (Vite proxy in dev)
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        Backend (Express 5)                          │
│  server/index.ts                                                     │
│  - helmet, cors, json parser                                         │
│  - /api/health                                                       │
│  - /api/payment/*                                                    │
│  - /api/reconciliation/*                                             │
│  - /api/disputes/*                                                   │
│  - /api/ai/*                                                         │
│                                                                      │
│  AI route handlers -> Gemini REST API (if GEMINI_API_KEY exists)    │
│                     -> safe demo fallback responses (if missing/down)│
└──────────────────────────────────────────────────────────────────────┘
```

### Runtime model

- Primary UX is simulation-first with rich demo datasets.
- AI endpoints are backend-mediated and use `GEMINI_API_KEY` from server env.
- If backend is unavailable or Gemini is not configured, frontend gracefully falls back to deterministic demo responses.

## 2) Frontend Architecture

### Stack

- React 19 + TypeScript
- Vite 8 (`@vitejs/plugin-react`, `@tailwindcss/vite`)
- React Router DOM 7 (nested route app shell)
- Zustand (persisted client stores)
- TanStack Query (query client configured globally)
- Sonner (toasts), Lucide icons, Recharts, Motion

### App shell pattern

- `src/App.tsx` defines lazy-loaded routes and global providers:
  - `QueryClientProvider`
  - `BrowserRouter`
  - `Toaster`
- Protected merchant routes render inside `AppShell`:
  - Sidebar
  - TopBar
  - Content outlet

### Auth and persistence

- `ProtectedRoute` enforces:
  - auth resolved
  - user exists
  - onboarding completed
- Demo auth bootstrap (`useAuthBootstrap`) sets demo auth mode and resolves session.
- State is persisted in localStorage through Zustand `persist` middleware.

Persisted stores:

- `payassist-auth`
- `payassist-merchant`
- `payassist-notifications`
- feature-specific local storage keys (for example payment links)

### Data layer split

- `src/lib/gemini.ts`
  - Calls backend `/api/ai/*`
  - Includes request timeout + temporary backend-down cooldown
  - Fallbacks to `src/data/demoAppData.ts` and `src/data/copilotDemoData.ts`
- `src/lib/paytm.ts`
  - Local simulation utility for verify, list, settlement, dispute, and payment-link operations

## 3) Backend Architecture

### Core server

Entry: `server/index.ts`

- Loads env from:
  1. root `.env`
  2. `server/.env`
- Middleware:
  - `helmet()`
  - `cors({ origin: FRONTEND_URL || "http://localhost:5173" })`
  - `express.json({ limit: "2mb" })`
- Health:
  - `GET /api/health`

### Route modules

- `server/routes/payment.ts`
- `server/routes/reconciliation.ts`
- `server/routes/dispute.ts`
- `server/routes/ai.ts`

Support middleware:

- `authenticate` (demo auth marker header)
- `apiRateLimiter` (enabled for payment routes)

### AI service design

`server/services/geminiService.ts`:

- Uses `GEMINI_API_KEY`
- Optional `GEMINI_MODEL` (defaults to `gemini-1.5-flash`)
- Calls Google Generative Language REST API
- Supports JSON response mode for structured outputs

AI routes always provide safe fallback behavior if:

- key is missing
- Gemini call fails
- response validation fails

## 4) Route Map (Frontend)

### Public routes

- `/` -> Landing page
- `/auth/login`
- `/auth/signup`
- `/auth/onboarding`

### Protected app routes

- `/app/dashboard`
- `/app/analytics`
- `/app/action-feed`
- `/app/verify`
- `/app/payment-links`
- `/app/router-insights`
- `/app/reconciliation`
- `/app/end-of-day`
- `/app/disputes`
- `/app/auto-sweep`
- `/app/vyapar-setu`
- `/app/voice-negotiator`
- `/app/genai-ad-engine`
- `/app/voice`
- `/app/notifications`
- `/app/settings`

## 5) API Map (Backend)

### Health

- `GET /api/health`

### Payments

- `POST /api/payment/verify`
- `POST /api/payment/link`

### Reconciliation

- `GET /api/reconciliation/transactions`
- `GET /api/reconciliation/settlement`

### Disputes

- `GET /api/disputes/`
- `POST /api/disputes/submit` (multipart form with docs)

### AI Copilot

- `POST /api/ai/explain-transaction`
- `POST /api/ai/draft-dispute`
- `POST /api/ai/merchant-query`
- `POST /api/ai/eod-summary`
- `POST /api/ai/router-analysis`
- `POST /api/ai/action-feed`
- `POST /api/ai/auto-sweep-plan`
- `POST /api/ai/vyapar-setu-network`
- `POST /api/ai/voice-negotiation`
- `POST /api/ai/genai-ad-campaign`

## 6) Feature Inventory

### Core operations

- Dashboard overview
- Payment verification
- Payment links
- Router insights
- Reconciliation
- End-of-day summary
- Disputes manager

### Copilot and AI modules

- Voice Copilot
- Action Feed
- Auto-Sweep Router
- Vyapar-Setu
- Voice Negotiator
- GenAI Ad Engine

### Settings

- App-level settings panel integrated in sidebar utility area

## 7) Environment Configuration

Backend-required (recommended in `server/.env` or root `.env`):

```bash
PORT=3001
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_key_here
# Optional:
GEMINI_MODEL=gemini-1.5-flash
```

Paytm placeholders supported by project (optional in current demo flow):

```bash
PAYTM_MERCHANT_ID_DEV=
PAYTM_MERCHANT_KEY_DEV=
PAYTM_WEBSITE_DEV=WEBSTAGING
PAYTM_CHANNEL_ID_DEV=WEB
PAYTM_INDUSTRY_TYPE_DEV=Retail
```

Frontend optional:

```bash
# Optional override. If omitted, frontend uses same-origin /api paths.
VITE_API_BASE_URL=http://localhost:3001
```

## 8) Local Development

### Prerequisites

- Node.js 20+ (project currently runs on modern Node and ESM)
- npm

### Install

```bash
npm install
```

### Start full stack (recommended)

```bash
npm run dev
```

`npm run dev` launches:

- backend: `npm run dev:server`
- frontend: `npm run dev:client`

### Start individually

```bash
npm run dev:server
npm run dev:client
```

### Production build and test

```bash
npm run build
npm run test
npm run lint
```

## 9) Repository Structure

```text
.
├─ public/
├─ server/
│  ├─ index.ts
│  ├─ middleware/
│  ├─ routes/
│  └─ services/
├─ src/
│  ├─ components/
│  ├─ data/
│  ├─ features/
│  ├─ hooks/
│  ├─ lib/
│  ├─ routes/
│  ├─ store/
│  └─ types/
├─ scripts/
│  └─ dev.mjs
├─ vite.config.ts
└─ package.json
```

## 10) Troubleshooting

### `http proxy error ... ECONNREFUSED` on `/api/*`

Cause:

- frontend running, backend not reachable on configured target (`localhost:3001` by default)

Fix:

1. Run full stack with `npm run dev`
2. Confirm backend boot log: `PayAssist server running on :3001`
3. Confirm `PORT` and `VITE_API_BASE_URL` are aligned if customized

### AI features show fallback/demo responses

Cause:

- `GEMINI_API_KEY` missing or invalid
- Gemini request failed/timeouts

Fix:

1. Set valid `GEMINI_API_KEY` in backend env
2. Restart backend
3. Re-trigger AI action

## 11) Notes

- Existing features are simulation-backed and intentionally resilient.
- Backend AI integration is additive and does not block baseline UI flows.
- This architecture is optimized for demo reliability and progressive hardening toward production integrations.
