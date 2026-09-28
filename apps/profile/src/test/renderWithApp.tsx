import { configureHttpClient } from '@saas/api-client';
import { AppProviders, createQueryClient } from '@saas/app-core';
import { RequireAuth, sessionStore } from '@saas/auth';
import type { User } from '@saas/domain';
import { createAppTheme } from '@saas/ui';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { createProfileI18n } from '@/i18n';
import { features } from '@/router/features';

/**
 * Renders the app's real feature routes with the real providers, signed in as `user`.
 * Use it together with the mock API server from @saas/mocks/node.
 */
export function renderWithApp(path: string, { user }: { user: User }) {
  configureHttpClient({
    baseUrl: 'http://localhost/api',
    getAccessToken: sessionStore.getAccessToken,
    onUnauthorized: sessionStore.clear,
  });
  sessionStore.set({ accessToken: `mock-token.${user.id}`, user });

  const router = createMemoryRouter(
    [{ element: <RequireAuth />, children: features.flatMap((feature) => feature.routes) }],
    { initialEntries: [path] },
  );

  render(
    <AppProviders theme={createAppTheme()} queryClient={createQueryClient()} i18n={createProfileI18n()}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { router };
}
