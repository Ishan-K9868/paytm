# PayAssist

PayAssist is a two-surface project:
- `/` is the existing marketing landing page.
- `/auth/*` and `/app/*` are the merchant product application based on the technical PRDs in `features and design/`.

Current implementation status:
- Routed landing + app shell is live.
- Core feature surfaces are implemented as interactive demo-backed workflows.
- Firebase, Paytm, and Gemini client/server integration layers now exist with demo-safe fallbacks.
- Express server scaffold exists under `server/`.

## Run

```bash
npm install
npm run dev:client
npm run dev:server
```

## Environment

Create a frontend `.env` file:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_BASE_URL=http://localhost:3001
```

Create a server `.env` file if you want to replace demo mode:

```bash
PORT=3001
FRONTEND_URL=http://localhost:5173
PAYTM_MERCHANT_ID_DEV=
PAYTM_MERCHANT_KEY_DEV=
PAYTM_WEBSITE_DEV=WEBSTAGING
PAYTM_CHANNEL_ID_DEV=WEB
PAYTM_INDUSTRY_TYPE_DEV=Retail
GEMINI_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Without these values, the app continues to work in demo fallback mode.

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
