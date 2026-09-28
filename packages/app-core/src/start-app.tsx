import { configureHttpClient } from '@saas/api-client';
import { sessionStore } from '@saas/auth';
import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

type StartAppOptions = {
  apiBaseUrl: string;
  startMockApi?: () => Promise<unknown>;
  render: () => ReactNode;
};

export async function startApp({ apiBaseUrl, startMockApi, render }: StartAppOptions) {
  configureHttpClient({
    baseUrl: apiBaseUrl,
    getAccessToken: sessionStore.getAccessToken,
    onUnauthorized: sessionStore.clear,
  });

  if (startMockApi) await startMockApi();

  const container = document.getElementById('root');
  if (!container) throw new Error('Missing #root element');
  createRoot(container).render(<StrictMode>{render()}</StrictMode>);
}