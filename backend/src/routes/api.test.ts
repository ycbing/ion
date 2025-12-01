import { copyFile, mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "../app";
import type {
  AiProviderRouter,
  CopyGenerationRequest,
  CopyGenerationResult,
  ImageGenerationRequest,
  ImageGenerationResult
} from "../providers/ai-provider-router";
import { ProviderRegistry } from "../providers/provider-registry";
import type { ProviderOverview } from "../providers/types";

const providersConfigFixture = fileURLToPath(
  new URL("../../config/providers.json", import.meta.url)
);

class RecordingRouter implements AiProviderRouter {
  public copyCalls: CopyGenerationRequest[] = [];

  public imageCalls: ImageGenerationRequest[] = [];

  async generateCopy(payload: CopyGenerationRequest): Promise<CopyGenerationResult> {
    this.copyCalls.push(payload);

    return {
      provider: payload.provider,
      variants: [
        {
          id: "copy-1",
          text: "Generated copy",
          metadata: payload.options ? { options: payload.options } : undefined
        }
      ]
    };
  }

  async generateImage(
    payload: ImageGenerationRequest
  ): Promise<ImageGenerationResult> {
    this.imageCalls.push(payload);

    return {
      provider: payload.provider,
      image: {
        url: "https://example.com/generated.png",
        altText: "Generated image"
      },
      metadata: {
        style: payload.style ?? {}
      }
    };
  }
}

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

const createConfigCopy = async (): Promise<string> => {
  const dir = await mkdtemp(join(tmpdir(), "providers-"));
  const targetPath = join(dir, "providers.json");
  await copyFile(providersConfigFixture, targetPath);
  return targetPath;
};

const createTestContext = async (
  router: AiProviderRouter = new RecordingRouter()
) => {
  const configPath = await createConfigCopy();
  const registry = new ProviderRegistry({ configPath });
  const app = createApp({ aiRouter: router, providerRegistry: registry });

  return { app, registry, configPath, router };
};

describe("API routes", () => {
  it("creates marketing copy drafts", async () => {
    const router = new RecordingRouter();
    const { app } = await createTestContext(router);

    const response = await request(app)
      .post("/api/copies")
      .send({
        topic: "Welcome email",
        options: {
          tone: "friendly",
          variants: 2
        }
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.provider).toBe("mock");
    expect(response.body.data.copies).toHaveLength(1);
    expect(router.copyCalls).toHaveLength(1);
    expect(router.copyCalls[0].provider).toBe("mock");
    expect(router.copyCalls[0].options?.tone).toBe("friendly");
  });

  it("returns a validation error for unsupported providers", async () => {
    const router = new RecordingRouter();
    const { app } = await createTestContext(router);

    const response = await request(app)
      .post("/api/copies")
      .send({
        topic: "Sales announcement",
        provider: "unsupported-provider"
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("PROVIDER_NOT_AVAILABLE");
    expect(router.copyCalls).toHaveLength(0);
  });

  it("creates image artifacts based on copy", async () => {
    const router = new RecordingRouter();
    const { app } = await createTestContext(router);

    const response = await request(app)
      .post("/api/images")
      .send({
        copy: "Join us for the product reveal.",
        style: {
          mood: "dramatic"
        }
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.provider).toBe("mock");
    expect(response.body.data.image.url).toContain("example.com");
    expect(router.imageCalls).toHaveLength(1);
    expect(router.imageCalls[0].provider).toBe("mock");
    expect(router.imageCalls[0].style?.mood).toBe("dramatic");
  });

  it("rejects malformed image payloads", async () => {
    const router = new RecordingRouter();
    const { app } = await createTestContext(router);

    const response = await request(app)
      .post("/api/images")
      .send({
        copy: "",
        style: {
          aspectRatio: "wrong"
        }
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(router.imageCalls).toHaveLength(0);
  });

  it("lists configured providers", async () => {
    const { app } = await createTestContext();

    const response = await request(app).get("/api/providers").expect(200);

    expect(response.body.success).toBe(true);
    const overview = response.body.data as ProviderOverview;
    expect(overview.text.active).toBe("mock");
    const openAiEntry = overview.text.providers.find((provider) => provider.name === "openai");
    expect(openAiEntry?.missingCredentials).toContain("apiKey");
    expect(openAiEntry?.isActive).toBe(false);

    const stabilityEntry = overview.image.providers.find(
      (provider) => provider.name === "stability"
    );
    expect(stabilityEntry?.missingCredentials).toContain("apiKey");
  });

  it("updates active providers when credentials are present", async () => {
    process.env.OPENAI_API_KEY = "test-openai";
    process.env.STABILITY_API_KEY = "test-stability";

    const { app, configPath } = await createTestContext();

    const response = await request(app)
      .patch("/api/providers/active")
      .send({
        text: "openai",
        image: "stability"
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    const overview = response.body.data as ProviderOverview;
    expect(overview.text.active).toBe("openai");
    expect(overview.image.active).toBe("stability");

    const openAiSummary = overview.text.providers.find(
      (provider) => provider.name === "openai"
    );
    expect(openAiSummary?.isActive).toBe(true);

    const fileContents = JSON.parse(await readFile(configPath, "utf-8"));
    expect(fileContents.text.active).toBe("openai");
    expect(fileContents.image.active).toBe("stability");
  });

  it("rejects switching to providers with missing credentials", async () => {
    delete process.env.OPENAI_API_KEY;

    const { app } = await createTestContext();

    const response = await request(app)
      .patch("/api/providers/active")
      .send({ text: "openai" })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("PROVIDER_CREDENTIALS_MISSING");
  });
});
