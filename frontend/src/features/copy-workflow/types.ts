export type CopyGenerationOptions = {
  tone?: string;
  audience?: string;
  keywords?: string[];
  language?: string;
  variants?: number;
};

export type GenerateCopyPayload = {
  topic: string;
  prompt?: string;
  options?: CopyGenerationOptions;
  provider?: string;
};

export type CopySuggestion = {
  id: string;
  text: string;
  metadata?: Record<string, unknown>;
};

export type CopyGenerationMetadata = {
  topic: string;
  requestedVariants: number;
  deliveredVariants: number;
};

export type CopyGenerationResult = {
  provider: string;
  copies: CopySuggestion[];
  metadata: CopyGenerationMetadata;
};

export type ImageStyleOptions = {
  palette?: string[];
  medium?: string;
  mood?: string;
  aspectRatio?: string;
};

export type GenerateImagePayload = {
  copy: string;
  provider?: string;
  style?: ImageStyleOptions;
};

export type GeneratedImageAsset = {
  url: string;
  altText: string;
};

export type GenerateImageResult = {
  provider: string;
  image: GeneratedImageAsset;
  metadata: {
    copyPreview: string;
    appliedStyle: Record<string, unknown>;
  };
};

export type WorkflowImageRecord = GenerateImageResult & {
  generatedAt: string;
  copyText: string;
};
