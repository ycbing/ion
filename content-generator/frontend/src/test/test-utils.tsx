import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";

import { theme } from "@/theme";

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface ProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

interface ProvidersProps {
  children: ReactNode;
  queryClient: QueryClient;
}

const Providers = ({ children, queryClient }: ProvidersProps) => (
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ChakraProvider>
);

export const renderWithProviders = (
  ui: ReactElement,
  { queryClient = createTestQueryClient(), ...renderOptions }: ProvidersOptions = {},
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Providers queryClient={queryClient}>{children}</Providers>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};
