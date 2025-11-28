export type ProviderDomain = "text" | "image";

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

export interface UpdateActiveProvidersPayload {
  text?: string;
  image?: string;
}
