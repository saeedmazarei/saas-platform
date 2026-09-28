import { configureHttpClient } from '@saas/api-client';
import { createSeedUsers } from '@saas/mocks';
import { createMockServer } from '@saas/mocks/node';
import { validationTranslations } from '@saas/domain';
import { createI18n, I18nProvider } from '@saas/i18n';
import { createAppTheme, uiTranslations, UiProvider } from '@saas/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AuthProvider } from './AuthProvider';
import { GuestOnly, RequireAuth } from './guards';
import { LoginPage } from './LoginPage';
import { sessionStore } from './session-store';
import { authTranslations } from './translations';

const { server } = createMockServer();
const [admin, member] = createSeedUsers();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
beforeEach(() => {
  sessionStore.clear();
  configureHttpClient({
    baseUrl: 'http://localhost/api',
    getAccessToken: sessionStore.getAccessToken,
    onUnauthorized: sessionStore.clear,
  });
});

function renderApp(initialPath: string, roles?: ('admin' | 'user')[]) {
  const router = createMemoryRouter(
    [
      {
        path: '/login',
        element: (
          <GuestOnly>
            <LoginPage productName="Test" />
          </GuestOnly>
        ),
      },
      {
        element: <RequireAuth roles={roles} />,
        children: [{ path: '/secret', element: <h1>Secret page</h1> }],
      },
    ],
    { initialEntries: [initialPath] },
  );
  const i18n = createI18n({ ...validationTranslations, ...uiTranslations, ...authTranslations });
  render(
    <I18nProvider i18n={i18n}>
      <QueryClientProvider client={new QueryClient()}>
        <UiProvider theme={createAppTheme()}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </UiProvider>
      </QueryClientProvider>
    </I18nProvider>,
  );
}

describe('authentication flow', () => {
  it('sends a signed-out user to login, then back to the page they wanted', async () => {
    renderApp('/secret');

    await userEvent.type(await screen.findByLabelText(/email/i), admin!.email);
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('heading', { name: 'Secret page' })).toBeInTheDocument();
    expect(sessionStore.getAccessToken()).toBeTruthy();
  });

  it('shows the server message for a wrong password', async () => {
    renderApp('/login');

    await userEvent.type(await screen.findByLabelText(/email/i), admin!.email);
    await userEvent.type(screen.getByLabelText(/password/i), 'nope');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Incorrect email or password.')).toBeInTheDocument();
  });

  it('denies access when the user does not have the required role', async () => {
    sessionStore.set({ accessToken: `mock-token.${member!.id}`, user: member! });
    renderApp('/secret', ['admin']);

    expect(await screen.findByText('Access denied')).toBeInTheDocument();
    expect(screen.queryByText('Secret page')).not.toBeInTheDocument();
  });

  it('ends a saved session that the server no longer accepts', async () => {
    sessionStore.set({ accessToken: 'mock-token.does-not-exist', user: admin! });
    renderApp('/secret');

    expect(await screen.findByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(sessionStore.getSession()).toBeNull();
  });
});
