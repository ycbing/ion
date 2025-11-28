export type ProviderDomain = "text" | "image";

export interface ProviderCredentialDefinition {
  env: string;
  optional?: boolean;
}

export type ProviderCredentialsConfig = Record<
  string,
  string | ProviderCredentialDefinition
>;

export interface ProviderDefinition {
  driver: string;
  label: string;
  promptTemplates?: Record<string, string>;
  credentials?: ProviderCredentialsConfig;
  options?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ProviderDomainConfig {
  active: string;
  providers: Record<string, ProviderDefinition>;
}

export interface ProviderConfigFile {
  text: ProviderDomainConfig;
  image: ProviderDomainConfig;
}

export interface CredentialStatus {
  envVar: string;
  optional: boolean;
  present: boolean;
}

export interface ProviderSummary {
  name: string;
  driver: string;
  label: string;
  promptTemplates: Record<string, string>;
  options: Record<string, unknown>;
  metadata: Record<string, unknown>;
  credentials: Record<string, CredentialStatus>;
  missingCredentials: string[];
  isActive: boolean;
}

export interface ProviderDomainSummary {
  active: string;
  providers: ProviderSummary[];
}

export interface ProviderOverview {
  text: ProviderDomainSummary;
  image: ProviderDomainSummary;
}

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

export interface ProviderInitPayload {
  name: string;
  driver: string;
  label: string;
  promptTemplates: Record<string, string>;
  options: Record<string, unknown>;
  metadata: Record<string, unknown>;
  credentials: Record<string, string | undefined>;
}

export interface TextProvider {
  readonly name: string;
  readonly label: string;
  readonly driver: string;
  readonly promptTemplates: Record<string, string>;
  readonly options: Record<string, unknown>;
  readonly metadata: Record<string, unknown>;
  readonly credentials: Record<string, string | undefined>;
  generate(payload: CopyGenerationRequest): Promise<CopyGenerationResult>;
}

export interface ImageProvider {
  readonly name: string;
  readonly label: string;
  readonly driver: string;
  readonly promptTemplates: Record<string, string>;
  readonly options: Record<string, unknown>;
  readonly metadata: Record<string, unknown>;
  readonly credentials: Record<string, string | undefined>;
  generate(payload: ImageGenerationRequest): Promise<ImageGenerationResult>;
}

export type TextProviderFactory = (payload: ProviderInitPayload) => TextProvider;
export type ImageProviderFactory = (payload: ProviderInitPayload) => ImageProvider;
