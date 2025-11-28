import cors from "cors";
import express from "express";
import { env } from "./env";
import { providerRegistry } from "./providers";

const app = express();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: env.nodeEnv,
    providers: providerRegistry
      .all()
      .map((provider) => ({ name: provider.name, label: provider.label })),
  });
});

app.get("/providers", (_req, res) => {
  res.json({ providers: providerRegistry.all() });
});

app.listen(env.backendPort, () => {
  console.log(
    `Backend ready on port ${env.backendPort} (mode: ${env.nodeEnv}). Serving ${providerRegistry
      .all()
      .length} providers.`
  );
});
