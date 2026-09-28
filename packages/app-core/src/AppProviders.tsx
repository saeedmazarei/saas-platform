import type { Theme } from '@mui/material/styles';
import { AuthProvider } from '@saas/auth';
import { I18nProvider, type I18n } from '@saas/i18n';
import { UiProvider } from '@saas/ui';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

type AppProvidersProps = {
  theme: Theme;
  queryClient: QueryClient;
  i18n: I18n;
  children: ReactNode;
};

/** The provider stack for every product. The order matters: auth uses the query client. */
export function AppProviders({ theme, queryClient, i18n, children }: AppProvidersProps) {
  return (
    <I18nProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <UiProvider theme={theme}>
          <AuthProvider>{children}</AuthProvider>
        </UiProvider>
      </QueryClientProvider>
    </I18nProvider>
  );
}
