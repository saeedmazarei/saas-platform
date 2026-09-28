import type { Theme } from '@mui/material/styles';
import { AuthProvider } from '@saas/auth';
import { UiProvider } from '@saas/ui';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

type AppProvidersProps = {
  theme: Theme;
  queryClient: QueryClient;
  children: ReactNode;
};

export function AppProviders({ theme, queryClient, children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UiProvider theme={theme}>
        <AuthProvider>{children}</AuthProvider>
      </UiProvider>
    </QueryClientProvider>
  );
}