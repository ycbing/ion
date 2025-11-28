export interface CopyGenerationOptions {
  tone?: string;
  audience?: string;
  keywords?: string[];
  language?: string;
  variants?: number;
}

export interface CopyGenerationRequest {
  provider: string;
  topic: string;
  prompt?: string;
  options?: CopyGenerationOptions;
}

export interface CopyVariant {
  id: string;
  text: string;
  metadata?: Record<string, unknown>;
}

export interface CopyGenerationResult {
  provider: string;
  variants: CopyVariant[];
}

export interface ImageGenerationStyle {
  palette?: string[];
  medium?: string;
  mood?: string;
  aspectRatio?: string;
}

export interface ImageGenerationRequest {
  provider: string;
  copy: string;
  style?: ImageGenerationStyle;
}

export interface GeneratedImage {
  url: string;
  altText: string;
}

export interface ImageGenerationResult {
  provider: string;
  image: GeneratedImage;
  metadata?: Record<string, unknown>;
}

export interface AiProviderRouter {
  generateCopy(payload: CopyGenerationRequest): Promise<CopyGenerationResult>;
  generateImage(payload: ImageGenerationRequest): Promise<ImageGenerationResult>;
}

class StubAiProviderRouter implements AiProviderRouter {
  async generateCopy(payload: CopyGenerationRequest): Promise<CopyGenerationResult> {
    const variantsRequested = payload.options?.variants ?? 1;
    const variantCount = Math.max(1, Math.min(variantsRequested, 5));

    const sanitizedTopic = payload.topic.trim();

    return {
      provider: payload.provider,
      variants: Array.from({ length: variantCount }).map((_value, index) => ({
        id: `${payload.provider}-copy-${index + 1}`,
        text: `Sample copy #${index + 1} for "${sanitizedTopic}"${payload.prompt ? ` (prompt: ${payload.prompt})` : ""}.`,
        metadata: {
          tone: payload.options?.tone ?? "neutral",
          audience: payload.options?.audience ?? "general",
          keywords: payload.options?.keywords ?? [],
          language: payload.options?.language ?? "en"
        }
      }))
    };
  }

  async generateImage(payload: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const normalizedCopy = payload.copy.replace(/\s+/g, " ").trim();
    const baseDescriptor = normalizedCopy.slice(0, 48);
    const descriptor = baseDescriptor.length < normalizedCopy.length ? `${baseDescriptor}…` : baseDescriptor;
    const styleMetadata = payload.style ?? {};

    return {
      provider: payload.provider,
      image: {
        url: `https://images.example.com/${payload.provider}/placeholder.png`,
        altText: `AI generated visual for: ${descriptor}`
      },
      metadata: {
        style: styleMetadata
      }
    };
  }
}

export const createAiProviderRouter = (): AiProviderRouter => new StubAiProviderRouter();
