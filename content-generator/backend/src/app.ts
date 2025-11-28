import cors from "cors";
import express from "express";
import type { AiProviderRouter } from "./providers/ai-provider-router";
import { createContainer } from "./container";
import { settings } from "./config";
import { requestLogger } from "./middleware/request-logger";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { providerRegistry } from "./providers";
import { createApiRouter } from "./routes/api";
import { successResponse } from "./utils/response";

export interface AppDependencies {
  aiRouter: AiProviderRouter;
}

export const createApp = ({ aiRouter }: AppDependencies) => {
  const app = express();

  app.set("trust proxy", true);

  app.use(
    cors({
      origin: settings.server.cors.origin,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(requestLogger);

  const container = createContainer({ aiRouter });

  app.get("/health", (_req, res) => {
    const providers = providerRegistry.all().map((provider) => ({
      name: provider.name,
      label: provider.label,
      models: provider.models,
      isDefault: provider.name === settings.providers.default
    }));

    res.json(
      successResponse({
        status: "ok",
        environment: settings.env,
        providers
      })
    );
  });

  app.get("/providers", (_req, res) => {
    res.json(
      successResponse({
        providers: providerRegistry.all(),
        defaultProvider: providerRegistry.default()?.name ?? null
      })
    );
  });

  app.use("/api", createApiRouter(container));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
