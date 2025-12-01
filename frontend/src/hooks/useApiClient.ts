import { useMemo } from "react";

import { apiClient } from "@/lib/api-client";

export const useApiClient = () => {
  return useMemo(() => apiClient, []);
};
