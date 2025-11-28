import { config as loadEnv } from "dotenv";

loadEnv();

const parsePort = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sanitizeList = (value: string | undefined, fallback: string[]) => {
  const tokens = (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return tokens.length > 0 ? tokens : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  backendPort: parsePort(process.env.CONTENT_BACKEND_PORT, 4000),
  frontendUrl: process.env.CONTENT_FRONTEND_URL ?? "http://localhost:5173",
  providerNames: sanitizeList(process.env.AI_PROVIDERS, ["openai", "anthropic"]),
  openAi: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
    baseUrl: process.env.OPENAI_API_BASE ?? "https://api.openai.com/v1",
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    baseUrl: process.env.ANTHROPIC_API_BASE ?? "https://api.anthropic.com",
    model: process.env.ANTHROPIC_MODEL ?? "claude-3-haiku-20240307",
  },
} as const;
