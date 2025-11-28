# Content Generator Monorepo

This repository now ships with a monorepo-oriented workspace located in `content-generator/` that contains both frontend and backend packages for building AI-assisted content generation tooling. The original UI demos (carousel, progressive-image, etc.) remain available alongside the new workspace.

## Prerequisites

- Node.js **20.10.0** or newer
- npm **9.x** or newer (ships with Node 20)

> Install the required Node.js version via [nvm](https://github.com/nvm-sh/nvm) or your preferred version manager before continuing.

## Getting Started

1. Install all dependencies for every workspace from the repository root:

   ```bash
   npm install
   ```

2. Copy the example environment file and update it with your keys and URLs:

   ```bash
   cp .env.example .env
   ```

3. Start the backend API:

   ```bash
   npm run dev --workspace content-generator/backend
   ```

4. In a second terminal, start the frontend application:

   ```bash
   npm run dev --workspace content-generator/frontend
   ```

Alternatively, run both concurrently from the root:

```bash
npm run dev
```

## Manual QA: Copy-to-image workflow

The dashboard now exposes an end-to-end “copy-to-image” studio powered by the backend API. To exercise the flow manually:

1. Follow the steps above (or run `npm run dev` from the repo root) so that both the Express API (default `http://localhost:4000`) and the Vite frontend (default `http://localhost:5173`) are running.
2. Visit `http://localhost:5173` in your browser and land on the Dashboard.
3. Inside the **Copy-to-image studio** card:
   - Enter a topic, optional creative direction, tone, audience, and keywords.
   - Click **Generate copy ideas** to call `POST /api/copies` and receive AI-written variants.
   - Edit or select the variant you prefer.
4. Adjust the visual style inputs (palette, medium, mood, aspect ratio) and click **Generate image**. This triggers `POST /api/images` and streams the resulting asset into the gallery.
5. Use the **Manage providers** button to open the settings drawer, switch the active text or image provider, and re-run the steps above to confirm the updated vendor is used.
6. Use the gallery actions to download the generated image or copy/share the asset URL.

## Workspace Layout

```
content-generator/
├── backend/          # Express + TypeScript API
│   ├── src/
│   │   ├── env.ts
│   │   ├── index.ts
│   │   └── providers/
│   │       ├── configs/
│   │       │   ├── anthropic.ts
│   │       │   └── openai.ts
│   │       └── index.ts
│   ├── package.json
│   └── tsconfig*.json
├── frontend/         # Vite + React frontend shell
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── ...
```

## Shared Tooling and Scripts

The repository uses [npm workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces) to manage packages. The root `package.json` exposes shared scripts that proxy into each workspace:

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Starts both backend and frontend in watch mode using `concurrently`. |
| `npm run build` | Runs `build` in every workspace sequentially. |
| `npm run lint` | Runs the TypeScript compiler in `--noEmit` mode for type-checking in each workspace. |
| `npm run dev --workspace <path>` | Targets a single workspace (frontend or backend).

## Environment Variables

All configurable values live in `.env` at the repository root (see `.env.example`). The most important keys are:

| Variable | Description |
| -------- | ----------- |
| `CONTENT_BACKEND_PORT` | Port the Express API listens on (default `4000`). |
| `CONTENT_FRONTEND_URL` | Base URL the frontend uses to talk to the API (default `http://localhost:5173`). |
| `VITE_API_BASE_URL` | Frontend environment variable that points to the backend API (default `http://localhost:4000`). |
| `AI_PROVIDERS` | Comma-separated list of enabled providers (`openai,anthropic`). |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` | Secrets used when calling respective providers. |
| `OPENAI_API_BASE`, `ANTHROPIC_API_BASE` | Override default base URLs when pointing at self-hosted gateways. |
| `OPENAI_MODEL`, `ANTHROPIC_MODEL` | Default model identifiers used by the backend when formatting requests. |

## Provider Configuration Structure

Provider integrations live in `content-generator/backend/src/providers/`. Each provider exports a `ProviderConfig` object inside `src/providers/configs/<provider>.ts` describing how to connect to the vendor. The registry (`src/providers/index.ts`) loads every config and exposes helper methods for resolving providers at runtime.

To add a new provider:

1. Create a new config file under `src/providers/configs/` exporting a `ProviderConfig`.
2. Append the new config to the array exported in `src/providers/index.ts`.
3. Add any required environment variables to `.env.example` and document them in this README.

## Frontend

The frontend is a Vite + React + TypeScript application styled with Chakra UI and a custom Xiaohongshu-inspired theme. Routing is handled by React Router and data fetching/state management by React Query with an Axios client that reads its base URL from `VITE_API_BASE_URL`. Shared layout primitives (`PageShell`, `SectionCard`) and form elements provide a consistent design language across screens.

Common scripts:

```bash
npm run dev --workspace content-generator/frontend
npm run build --workspace content-generator/frontend
npm run lint --workspace content-generator/frontend
npm run test --workspace content-generator/frontend
```

## Backend

The backend is an Express server written in TypeScript. It exposes a health endpoint and a simple provider listing stub to demonstrate how provider metadata can be surfaced to the frontend.

Common scripts:

```bash
npm run dev --workspace content-generator/backend
npm run build --workspace content-generator/backend
npm run lint --workspace content-generator/backend
npm run start --workspace content-generator/backend
```

## Additional Notes

- `.editorconfig` defines consistent formatting across editors.
- `.gitignore` filters Node-specific artifacts such as `node_modules/`, build outputs, and environment files.
- `tsconfig.base.json` centralises TypeScript compiler settings shared across workspaces.

Feel free to explore the existing demo folders for standalone JavaScript samples unrelated to the new monorepo workspace.
