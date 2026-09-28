import { AppProviders, createQueryClient } from '@saas/app-core';
import { createAppTheme } from '@saas/ui';
import { RouterProvider } from 'react-router';
import { createProfileI18n } from './i18n';
import { router } from './router/router';

const queryClient = createQueryClient();
const i18n = createProfileI18n();
const theme = createAppTheme({ primaryColor: '#0c8599' });

export function App() {
  return (
    <AppProviders theme={theme} queryClient={queryClient} i18n={i18n}>
      <RouterProvider router={router} />
    </AppProviders>
  );
}