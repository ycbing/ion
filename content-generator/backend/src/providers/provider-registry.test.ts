import { copyFile, mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, afterEach } from "vitest";
import { ProviderRegistry } from "./provider-registry";
import type { ProviderOverview } from "./types";

const providersConfigFixture = fileURLToPath(
  new URL("../../config/providers.json", import.meta.url)
);

const initialEnv = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  STABILITY_API_KEY: process.env.STABILITY_API_KEY
};

const resetEnv = () => {
  if (initialEnv.OPENAI_API_KEY === undefined) {
    delete process.env.OPENAI_API_KEY;
  } else {
    process.env.OPENAI_API_KEY = initialEnv.OPENAI_API_KEY;
  }

  if (initialEnv.STABILITY_API_KEY === undefined) {
    delete process.env.STABILITY_API_KEY;
  } else {
    process.env.STABILITY_API_KEY = initialEnv.STABILITY_API_KEY;
  }
};

afterEach(() => {
  resetEnv();
});

const createRegistry = async () => {
  const dir = await mkdtemp(join(tmpdir(), "providers-registry-"));
  const configPath = join(dir, "providers.json");
  await copyFile(providersConfigFixture, configPath);
  const registry = new ProviderRegistry({ configPath });
  return { registry, configPath };
};

describe("ProviderRegistry", () => {
  it("lists providers with credential status", async () => {
    delete process.env.OPENAI_API_KEY;

    const { registry } = await createRegistry();
    const overview = registry.listProviders();

    expect(overview.text.active).toBe("mock");
    const openAiEntry = overview.text.providers.find((provider) => provider.name === "openai");
    expect(openAiEntry?.missingCredentials).toContain("apiKey");
    expect(openAiEntry?.credentials.apiKey.present).toBe(false);
  });

  it("resolves provider names with fallback to the active entry", async () => {
    const { registry } = await createRegistry();

    expect(registry.resolveTextProviderName()).toBe("mock");
    expect(registry.resolveImageProviderName()).toBe("mock");
    expect(registry.resolveTextProviderName(" MOCK ")).toBe("mock");
  });

  it("persists active selections to disk", async () => {
    process.env.OPENAI_API_KEY = "registry-openai";
    process.env.STABILITY_API_KEY = "registry-stability";

    const { registry, configPath } = await createRegistry();

    const updated = await registry.setActiveProviders({ text: "openai", image: "stability" });
    expect(updated.text.active).toBe("openai");
    expect(updated.image.active).toBe("stability");

    const fileContents = JSON.parse(await readFile(configPath, "utf-8"));
    expect(fileContents.text.active).toBe("openai");
    expect(fileContents.image.active).toBe("stability");
  });

  it("throws when activating providers missing credentials", async () => {
    delete process.env.OPENAI_API_KEY;

    const { registry } = await createRegistry();

    await expect(registry.setActiveProviders({ text: "openai" })).rejects.toHaveProperty(
      "code",
      "PROVIDER_CREDENTIALS_MISSING"
    );
  });
});
