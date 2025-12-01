export type ProviderDomain = "text" | "image";

export type CredentialStatus = {
  envVar: string;
  optional: boolean;
  present: boolean;
};

export type ProviderSummary = {
  name: string;
  driver: string;
  label: string;
  promptTemplates: Record<string, string>;
  options: Record<string, unknown>;
  metadata: Record<string, unknown>;
  credentials: Record<string, CredentialStatus>;
  missingCredentials: string[];
  isActive: boolean;
};

export type ProviderDomainSummary = {
  active: string;
  providers: ProviderSummary[];
};

export type ProviderOverview = {
  text: ProviderDomainSummary;
  image: ProviderDomainSummary;
};

export type UpdateActiveProvidersPayload = {
  text?: string;
  image?: string;
};
