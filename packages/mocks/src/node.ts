import { setupServer } from 'msw/node';
import { createMockDb } from './db';
import { createHandlers, type MockApiOptions } from './handlers';

export function createMockServer(options: MockApiOptions = {}) {
  const db = createMockDb();
  const server = setupServer(...createHandlers(db, options));
  return { db, server };
}