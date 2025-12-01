import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/hooks";
import { ensureSuccess } from "@/lib/api-helpers";
import type { ApiEnvelope } from "@/types/api";
import { providerOverviewFallback } from "./mocks";
import type {
  ProviderDomainSummary,
  ProviderOverview,
  ProviderSummary,
  UpdateActiveProvidersPayload,
} from "./types";

export const PROVIDERS_QUERY_KEY = ["providers", "overview"] as const;

const normalizeProviderSummary = (
  summary: ProviderSummary,
  activeName: string,
): ProviderSummary => ({
  ...summary,
  promptTemplates: summary.promptTemplates ?? {},
  options: summary.options ?? {},
  metadata: summary.metadata ?? {},
  credentials: summary.credentials ?? {},
  missingCredentials: summary.missingCredentials ?? [],
  isActive: summary.name === activeName,
});

const normalizeDomain = (
  domain: ProviderDomainSummary | undefined,
  fallback: ProviderDomainSummary,
): ProviderDomainSummary => {
  const usableDomain = domain ?? fallback;
  const providers = usableDomain.providers?.length
    ? usableDomain.providers
    : fallback.providers;

  const activeCandidate = usableDomain.active ?? fallback.active;
  const providerNames = providers.map((provider) => provider.name);
  const normalizedActive = providerNames.includes(activeCandidate)
    ? activeCandidate
    : providers[0]?.name ?? fallback.active;

  return {
    active: normalizedActive,
    providers: providers.map((provider) => normalizeProviderSummary(provider, normalizedActive)),
  };
};

const normalizeProviderOverview = (payload?: ProviderOverview): ProviderOverview => ({
  text: normalizeDomain(payload?.text, providerOverviewFallback.text),
  image: normalizeDomain(payload?.image, providerOverviewFallback.image),
});

export const useProviderOverview = () => {
  const client = useApiClient();

  return useQuery({
    queryKey: PROVIDERS_QUERY_KEY,
    queryFn: async (): Promise<ProviderOverview> => {
      const response = await client.get<ApiEnvelope<ProviderOverview>>("/providers");
      const envelope = ensureSuccess(response.data);
      return normalizeProviderOverview(envelope.data);
    },
    placeholderData: providerOverviewFallback,
  });
};

export const useUpdateActiveProviders = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: UpdateActiveProvidersPayload,
    ): Promise<ProviderOverview> => {
      const response = await client.patch<ApiEnvelope<ProviderOverview>>(
        "/providers/active",
        payload,
      );
      const envelope = ensureSuccess(response.data);
      return normalizeProviderOverview(envelope.data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROVIDERS_QUERY_KEY, data);
    },
  });
};
