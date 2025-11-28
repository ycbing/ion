import { createApp } from "./app";
import { settings } from "./config";
import { createAiProviderRouter } from "./providers/ai-provider-router";
import { createProviderRegistry } from "./providers";

const providerRegistry = createProviderRegistry();
const aiRouter = createAiProviderRouter(providerRegistry);

const app = createApp({ aiRouter, providerRegistry });

const server = app.listen(settings.server.port, settings.server.host, () => {
  const overview = providerRegistry.listProviders();
  const textProviders = overview.text.providers.map((provider) => provider.name).join(", ");
  const imageProviders = overview.image.providers.map((provider) => provider.name).join(", ");

  console.log(
    `Backend ready on ${settings.server.host}:${settings.server.port} (env: ${settings.env}). ` +
      `Text providers: ${textProviders}. Image providers: ${imageProviders}.`
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
