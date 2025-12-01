import cors from "cors";
import express from "express";
import type { AiProviderRouter } from "./providers/ai-provider-router";
import type { ProviderRegistry } from "./providers/provider-registry";
import { createContainer } from "./container";
import { settings } from "./config";
import { requestLogger } from "./middleware/request-logger";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { createApiRouter } from "./routes/api";
import { successResponse } from "./utils/response";

export interface AppDependencies {
  aiRouter: AiProviderRouter;
  providerRegistry: ProviderRegistry;
}

export const createApp = ({ aiRouter, providerRegistry }: AppDependencies) => {
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

  const container = createContainer({ aiRouter, providerRegistry });

  app.get("/health", (_req, res) => {
    const overview = providerRegistry.listProviders();

    res.json(
      successResponse({
        status: "ok",
        environment: settings.env,
        providers: overview
      })
    );
  });

  app.use("/api", createApiRouter(container));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
