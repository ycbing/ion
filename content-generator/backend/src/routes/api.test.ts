import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app";
import type {
  AiProviderRouter,
  CopyGenerationRequest,
  CopyGenerationResult,
  ImageGenerationRequest,
  ImageGenerationResult
} from "../providers/ai-provider-router";

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

describe("API routes", () => {
  it("creates marketing copy drafts", async () => {
    const router = new RecordingRouter();
    const app = createApp({ aiRouter: router });

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
    expect(response.body.data.provider).toBe("openai");
    expect(response.body.data.copies).toHaveLength(1);
    expect(router.copyCalls).toHaveLength(1);
    expect(router.copyCalls[0].options?.tone).toBe("friendly");
  });

  it("returns a validation error for unsupported providers", async () => {
    const router = new RecordingRouter();
    const app = createApp({ aiRouter: router });

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
    const app = createApp({ aiRouter: router });

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
    expect(response.body.data.image.url).toContain("example.com");
    expect(router.imageCalls).toHaveLength(1);
    expect(router.imageCalls[0].style?.mood).toBe("dramatic");
  });

  it("rejects malformed image payloads", async () => {
    const router = new RecordingRouter();
    const app = createApp({ aiRouter: router });

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
});
