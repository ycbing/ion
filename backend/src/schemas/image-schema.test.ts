import { describe, expect, it } from "vitest";
import { generateImageSchema } from "./image-schema";

describe("generateImageSchema", () => {
  it("validates a minimal payload", () => {
    const result = generateImageSchema.safeParse({
      copy: "Use our AI copilot to accelerate marketing updates."
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid aspect ratios", () => {
    const result = generateImageSchema.safeParse({
      copy: "Create a visual",
      style: {
        aspectRatio: "square"
      }
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty palettes", () => {
    const result = generateImageSchema.safeParse({
      copy: "Design a promotional poster",
      style: {
        palette: []
      }
    });

    expect(result.success).toBe(false);
  });
});
