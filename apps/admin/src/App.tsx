import { AppProviders, createQueryClient } from '@saas/app-core';
import { createAppTheme } from '@saas/ui';
import { RouterProvider } from 'react-router';
import { router } from './router/router';

const queryClient = createQueryClient();
const theme = createAppTheme({ primaryColor: '#3b5bdb' });

export function App() {
  return (
    <AppProviders theme={theme} queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>
  );
}