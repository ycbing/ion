import { createApp } from "./app";
import { settings } from "./config";
import { createAiProviderRouter } from "./providers/ai-provider-router";
import { providerRegistry } from "./providers";

const app = createApp({ aiRouter: createAiProviderRouter() });

const server = app.listen(settings.server.port, settings.server.host, () => {
  const providerNames = providerRegistry.all().map((provider) => provider.name);
  console.log(
    `Backend ready on ${settings.server.host}:${settings.server.port} (env: ${settings.env}). Providers: ${providerNames.join(", ")}`
  );
});

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`Received ${signal}, shutting down`);
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (error) => {
  console.error("[UnhandledRejection]", error);
});

process.on("uncaughtException", (error) => {
  console.error("[UncaughtException]", error);
  shutdown("SIGTERM");
});
