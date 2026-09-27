import { setupWorker } from 'msw/browser';
import { createMockDb } from './db';
import { createHandlers, type MockApiOptions } from './handlers';

type StartMockApiOptions = MockApiOptions & {
  serviceWorkerUrl?: string;
};

export async function startMockApi({ serviceWorkerUrl = '/mockServiceWorker.js', ...options }: StartMockApiOptions = {}) {
  const db = createMockDb({ storage: window.localStorage });
  const worker = setupWorker(...createHandlers(db, { latencyMs: 300, ...options }));
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
    serviceWorker: { url: serviceWorkerUrl },
  });
  return { db, worker };
}