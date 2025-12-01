# Content Generator

Content Generator is a full-stack workspace for building AI-assisted copywriting and image generation tooling. The repository is split into two packages: a TypeScript Express backend that brokers provider APIs and a Vite + React frontend that delivers the operator experience.

## Project structure

```
.
├── backend/            # Express + TypeScript API
│   ├── src/
│   ├── config/
│   ├── package.json
│   └── tsconfig*.json
├── frontend/           # Vite + React dashboard
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── .env.example        # Sample environment variables shared by both packages
├── package.json        # Workspace configuration and shared scripts
└── tsconfig.base.json  # Base TypeScript configuration extended by each package
```

## Requirements

- Node.js **20.10.0** or newer
- npm **9.x** or newer (ships with Node 20)

Use [nvm](https://github.com/nvm-sh/nvm) or your preferred version manager to install the required Node.js version before continuing.

## Getting started

1. Install all workspace dependencies from the repository root:

   ```bash
   npm install
   ```

2. Copy the example environment file and tailor the values to your setup:

   ```bash
   cp .env.example .env
   ```

3. Start both the backend API and the frontend application concurrently:

   ```bash
   npm run dev
   ```

   The command above spawns `npm run dev --workspace backend` and `npm run dev --workspace frontend` via `concurrently`.

4. Visit the dashboard at [http://localhost:5173](http://localhost:5173). The frontend proxies API calls to the backend at [http://localhost:4000](http://localhost:4000) by default.

### Running packages individually

- Backend in watch mode: `npm run dev --workspace backend`
- Frontend in watch mode: `npm run dev --workspace frontend`

### Building for production

Run the build task for both packages:

```bash
npm run build
```

Artifacts are emitted into `backend/dist/` and `frontend/dist/` respectively.

## Environment variables

The backend and frontend share a `.env` file at the repository root. Key variables include:

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `CONTENT_BACKEND_PORT` | Port used by the Express server. | `4000` |
| `CONTENT_FRONTEND_URL` | Public URL of the frontend (used for CORS). | `http://localhost:5173` |
| `VITE_API_BASE_URL` | Base URL the frontend uses for API requests. | `http://localhost:4000` |
| `OPENAI_API_KEY` | Credential for the OpenAI text provider. | _unset_ |
| `STABILITY_API_KEY` | Credential for the Stability image provider. | _unset_ |

Refer to `backend/config/*.json` for additional provider metadata and tweak values as needed.

## Backend overview

The backend lives in the `backend/` workspace. It exposes REST endpoints for:

- `POST /api/copies` – generate marketing copy variants.
- `POST /api/images` – produce illustrative assets based on copy and styling inputs.
- `GET /api/providers` – inspect registered providers and their credential status.

Requests are validated with [Zod](https://github.com/colinhacks/zod), configuration is loaded from the `config/` directory with `dotenv` overrides, and providers are resolved dynamically so you can plug in additional vendors without code changes.

Useful scripts:

```bash
npm run dev --workspace backend      # Start the API with hot reloading
npm run build --workspace backend    # Type-check and emit compiled output
npm run test --workspace backend     # Execute Vitest suites
```

## Frontend overview

The frontend lives in the `frontend/` workspace. It is a Vite + React application styled with Chakra UI and driven by TanStack Query for data fetching. API calls are made through a shared Axios instance that reads `VITE_API_BASE_URL` from the root `.env` file.

Useful scripts:

```bash
npm run dev --workspace frontend     # Start the Vite development server
npm run build --workspace frontend   # Create a production build
npm run lint --workspace frontend    # Run ESLint with TypeScript support
npm run test --workspace frontend    # Execute Jest + Testing Library suites
```

## Testing & quality

From the repository root you can run aggregate commands across all workspaces:

- `npm run lint` – Type-check / lint each package.
- `npm run format` – Run any configured formatting tasks.
- `npm run test` – Execute test suites that are present in each workspace.

Individual package scripts can also be invoked directly via `--workspace` as shown above.

## Deployment notes

- The backend expects provider credentials (`OPENAI_API_KEY`, `STABILITY_API_KEY`, etc.) to be available in the environment where it runs.
- The frontend build embeds `VITE_*` variables at compile time. Ensure `VITE_API_BASE_URL` points to the deployed backend before running `npm run build --workspace frontend` for production use.

Happy shipping!
