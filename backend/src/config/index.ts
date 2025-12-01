import config from "config";
import { config as loadEnv } from "dotenv";

type StringOrStringArray = string | string[];

loadEnv();

const normalizeCorsOrigins = (value: StringOrStringArray): string | string[] => {
  if (Array.isArray(value)) {
    return value;
  }

  const tokens = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  if (tokens.length === 0) {
    return value;
  }

  return tokens.length === 1 ? tokens[0] : tokens;
};

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
}

const envName = process.env.NODE_ENV ?? "development";

export const settings: Settings = {
  env: envName,
  server: {
    host: config.get<string>("server.host"),
    port: config.get<number>("server.port"),
    cors: {
      origin: normalizeCorsOrigins(
        config.get<StringOrStringArray>("server.cors.origin")
      )
    }
  },
  logging: {
    level: config.get<string>("logging.level")
  }
};
