# PayAssist

PayAssist is a two-surface project:
- `/` is the existing marketing landing page.
- `/auth/*` and `/app/*` are the merchant product application based on the technical PRDs in `features and design/`.

Current implementation status:
- Routed landing + app shell is live.
- Core feature surfaces are implemented as interactive demo-backed workflows.
- Hackathon runtime uses localStorage for auth/persistence.
- Gemini can run directly from the frontend using a Vercel environment variable.
- Express server scaffold still exists, but the current hackathon runtime does not require it.

## Run

```bash
npm install
npm run dev:client
```

## Environment

Create a frontend `.env` file:

```bash
VITE_GEMINI_API_KEY=
VITE_GEMINI_MODEL=gemini-1.5-flash
```

For a hackathon deployment, you can skip Firebase and keep auth/data in localStorage.
If you also want to skip Express, Gemini calls can run directly in the frontend using `VITE_GEMINI_API_KEY`.

`VITE_API_BASE_URL` is optional and only needed if you decide to re-enable a backend route path later.

Create a server `.env` file only if you want to keep the backend route path:

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

Without these values, the app continues to work in demo fallback mode.
