import config from "config";
import { config as loadEnv } from "dotenv";

loadEnv();

type StringOrStringArray = string | string[];

const normalizeList = (value: StringOrStringArray | undefined): string[] => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter((entry) => entry.trim().length > 0);
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

const normalizeProviderName = (value: string) => value.trim().toLowerCase();

const normalizeCorsOrigins = (value: StringOrStringArray): string | string[] => {
  if (Array.isArray(value)) {
    return value;
  }

  const tokens = normalizeList(value);
  if (tokens.length === 0) {
    return value;
  }

  return tokens.length === 1 ? tokens[0] : tokens;
};

export interface ProviderSettings {
  enabled: string[];
  default: string;
}

export interface AiModelConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface Settings {
  env: string;
  server: {
    host: string;
    port: number;
    cors: {
      origin: string | string[];
    };
  };
  logging: {
    level: string;
  };
  providers: ProviderSettings;
  ai: {
    openai: AiModelConfig;
    anthropic: AiModelConfig;
  };
}

const envName = process.env.NODE_ENV ?? "development";

const rawEnabledProviders = config.get<StringOrStringArray | undefined>(
  "providers.enabled"
);
const enabledProviders = normalizeList(rawEnabledProviders).map(
  normalizeProviderName
);

const defaultProvider = normalizeProviderName(
  config.get<string>("providers.default")
);

if (!enabledProviders.includes(defaultProvider)) {
  enabledProviders.push(defaultProvider);
}

export const settings: Settings = {
  env: envName,
  server: {
    host: config.get<string>("server.host"),
    port: config.get<number>("server.port"),
    cors: {
      origin: normalizeCorsOrigins(config.get<StringOrStringArray>("server.cors.origin"))
    }
  },
  logging: {
    level: config.get<string>("logging.level")
  },
  providers: {
    enabled: enabledProviders,
    default: defaultProvider
  },
  ai: {
    openai: config.get<AiModelConfig>("ai.openai"),
    anthropic: config.get<AiModelConfig>("ai.anthropic")
  }
};
