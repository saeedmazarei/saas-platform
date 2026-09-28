import { createMockServer } from '@saas/mocks/node';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { configureHttpClient, getUsersList, isApiError, login } from './index';

const { server } = createMockServer();
let token: string | null = null;
const onUnauthorized = vi.fn();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

beforeEach(() => {
  token = null;
  onUnauthorized.mockReset();
  configureHttpClient({ baseUrl: 'http://localhost/api', getAccessToken: () => token, onUnauthorized });
});

describe('http client', () => {
  it('sends the token and returns validated data', async () => {
    token = (await login({ email: 'admin@example.com', password: 'password123' })).accessToken;

    const page = await getUsersList({ page: 1, pageSize: 5 });

    expect(page.items).toHaveLength(5);
    expect(page.total).toBeGreaterThan(5);
  });

  it('turns a 401 into an ApiError and ends the session', async () => {
    const error = await getUsersList({ page: 1, pageSize: 5 }).catch((e: unknown) => e);

    expect(isApiError(error) && error.status).toBe(401);
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it('does not end the session when the login itself fails', async () => {
    const error = await login({ email: 'admin@example.com', password: 'wrong' }).catch((e: unknown) => e);

    expect(isApiError(error) && error.message).toBe('Incorrect email or password.');
    expect(onUnauthorized).not.toHaveBeenCalled();
  });
});
