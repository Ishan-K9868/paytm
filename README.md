# PayAssist

PayAssist is a two-surface project:
- `/` is the existing marketing landing page.
- `/auth/*` and `/app/*` are the merchant product application based on the technical PRDs in `features and design/`.

Current implementation status:
- Routed landing + app shell is live.
- Core feature surfaces are implemented as interactive demo-backed workflows.
- Hackathon runtime uses localStorage for auth/persistence.
- AI flows now run through the Express backend endpoints.
- Gemini uses `GEMINI_API_KEY` from the backend `.env`.

## Run

```bash
npm install
npm run dev
```

`npm run dev` now starts both backend (`/api`) and frontend (`vite`) together.

## Environment

Create a server `.env` file:

```bash
PORT=3001
FRONTEND_URL=http://localhost:5173
PAYTM_MERCHANT_ID_DEV=
PAYTM_MERCHANT_KEY_DEV=
PAYTM_WEBSITE_DEV=WEBSTAGING
PAYTM_CHANNEL_ID_DEV=WEB
PAYTM_INDUSTRY_TYPE_DEV=Retail
GEMINI_API_KEY=
```

`VITE_API_BASE_URL` is optional in the frontend. If omitted, client requests use same-origin `/api` paths (works with Vite proxy in local dev).

Without `GEMINI_API_KEY`, AI endpoints automatically fall back to demo responses so the app still runs.
