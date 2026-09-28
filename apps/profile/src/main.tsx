import { startApp } from '@saas/app-core';
import { App } from './App';
import { env } from './config/env';

void startApp({
  apiBaseUrl: env.VITE_API_URL,
  startMockApi: env.VITE_ENABLE_MOCKS
    ? () => import('@saas/mocks/browser').then((mocks) => mocks.startMockApi())
    : undefined,
  render: () => <App />,
});