import { describe, expect, it } from "vitest";
import { generateCopySchema } from "./copy-schema";

describe("generateCopySchema", () => {
  it("validates a minimal payload", () => {
    const result = generateCopySchema.safeParse({
      topic: "Product Launch"
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.topic).toBe("Product Launch");
    }
  });

  it("rejects topics that are too short", () => {
    const result = generateCopySchema.safeParse({
      topic: "Hi"
    });

    expect(result.success).toBe(false);
  });

  it("rejects requests for too many variants", () => {
    const result = generateCopySchema.safeParse({
      topic: "Conference Announcement",
      options: {
        variants: 9
      }
    });

    expect(result.success).toBe(false);
  });
});
