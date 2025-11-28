import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/hooks";
import { providerFallback } from "./mocks";
import type { Provider } from "./types";

const PROVIDERS_QUERY_KEY = ["providers"] as const;

interface ProvidersResponse {
  providers?: Provider[];
}

const normalizeProviders = (payload?: Provider[]): Provider[] => {
  if (!payload || payload.length === 0) {
    return providerFallback;
  }

  return payload.map((provider) => ({
    ...provider,
    models: provider.models ?? [],
  }));
};

export const useProviders = () => {
  const client = useApiClient();

  return useQuery({
    queryKey: PROVIDERS_QUERY_KEY,
    queryFn: async (): Promise<Provider[]> => {
      try {
        const { data } = await client.get<ProvidersResponse>("/providers");
        return normalizeProviders(data.providers);
      } catch (error) {
        console.warn("[providers] Falling back to mock provider data", error);
        return providerFallback;
      }
    },
    initialData: providerFallback,
  });
};
