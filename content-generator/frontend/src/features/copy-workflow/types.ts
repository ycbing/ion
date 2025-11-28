export interface CopyGenerationOptions {
  tone?: string;
  audience?: string;
  keywords?: string[];
  language?: string;
  variants?: number;
}

export interface GenerateCopyPayload {
  topic: string;
  prompt?: string;
  options?: CopyGenerationOptions;
  provider?: string;
}

export interface CopySuggestion {
  id: string;
  text: string;
  metadata?: Record<string, unknown>;
}

export interface CopyGenerationMetadata {
  topic: string;
  requestedVariants: number;
  deliveredVariants: number;
}

export interface CopyGenerationResult {
  provider: string;
  copies: CopySuggestion[];
  metadata: CopyGenerationMetadata;
}

export interface ImageStyleOptions {
  palette?: string[];
  medium?: string;
  mood?: string;
  aspectRatio?: string;
}

export interface GenerateImagePayload {
  copy: string;
  provider?: string;
  style?: ImageStyleOptions;
}

export interface GeneratedImageAsset {
  url: string;
  altText: string;
}

export interface GenerateImageResult {
  provider: string;
  image: GeneratedImageAsset;
  metadata: {
    copyPreview: string;
    appliedStyle: Record<string, unknown>;
  };
}

export interface WorkflowImageRecord extends GenerateImageResult {
  generatedAt: string;
  copyText: string;
}
