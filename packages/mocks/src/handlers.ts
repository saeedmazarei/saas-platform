import { delay, http, HttpResponse } from 'msw';
import {
  loginSchema,
  updateProfileSchema,
  updateUserSchema,
  userRoleSchema,
  type User,
} from '@saas/domain';
import type { MockDb } from './db';
import { DEMO_PASSWORD } from './seed';

export type MockApiOptions = {
  basePath?: string;
  latencyMs?: number;
};

const TOKEN_PREFIX = 'mock-token.';

const errorResponse = (status: number, message: string, extra?: Record<string, unknown>) =>
  HttpResponse.json({ message, ...extra }, { status });

const toPositiveInt = (value: string | null, fallback: number, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
};

export function createHandlers(db: MockDb, { basePath = '/api', latencyMs = 0 }: MockApiOptions = {}) {
  const route = (path: string) => `*${basePath}${path}`;
  const simulateLatency = () => (latencyMs > 0 ? delay(latencyMs) : Promise.resolve());

  const authenticate = (request: Request): User | Response => {
    const header = request.headers.get('Authorization') ?? '';
    const token = header.replace(/^Bearer\s+/i, '');
    const user = token.startsWith(TOKEN_PREFIX) ? db.getUser(token.slice(TOKEN_PREFIX.length)) : undefined;
    if (!user || user.status !== 'active') {
      return errorResponse(401, 'Your session has expired. Please sign in again.');
    }
    return user;
  };

  const authenticateAdmin = (request: Request): User | Response => {
    const result = authenticate(request);
    if (result instanceof Response) return result;
    return result.role === 'admin' ? result : errorResponse(403, 'Administrator access is required.');
  };

  return [
    http.post(route('/auth/login'), async ({ request }) => {
      await simulateLatency();
      const parsed = loginSchema.safeParse(await request.json());
      if (!parsed.success) return errorResponse(400, 'Invalid request.', { issues: parsed.error.issues });

      const user = db.findUserByEmail(parsed.data.email);
      if (!user || parsed.data.password !== DEMO_PASSWORD) {
        return errorResponse(401, 'Incorrect email or password.');
      }
      if (user.status !== 'active') return errorResponse(403, 'This account has been suspended.');

      return HttpResponse.json({ accessToken: `${TOKEN_PREFIX}${user.id}`, user });
    }),

    http.post(route('/auth/logout'), async () => {
      await simulateLatency();
      return new HttpResponse(null, { status: 204 });
    }),

    http.get(route('/me'), async ({ request }) => {
      await simulateLatency();
      const user = authenticate(request);
      return user instanceof Response ? user : HttpResponse.json(user);
    }),

    http.patch(route('/me'), async ({ request }) => {
      await simulateLatency();
      const user = authenticate(request);
      if (user instanceof Response) return user;

      const parsed = updateProfileSchema.safeParse(await request.json());
      if (!parsed.success) return errorResponse(400, 'Invalid profile data.', { issues: parsed.error.issues });

      return HttpResponse.json(db.updateUser(user.id, parsed.data));
    }),

    http.get(route('/users'), async ({ request }) => {
      await simulateLatency();
      const admin = authenticateAdmin(request);
      if (admin instanceof Response) return admin;

      const params = new URL(request.url).searchParams;
      return HttpResponse.json(
        db.listUsers({
          page: toPositiveInt(params.get('page'), 1),
          pageSize: toPositiveInt(params.get('pageSize'), 10, 100),
          search: params.get('search') ?? undefined,
          role: userRoleSchema.safeParse(params.get('role')).data,
        }),
      );
    }),

    http.get<{ id: string }>(route('/users/:id'), async ({ request, params }) => {
      await simulateLatency();
      const admin = authenticateAdmin(request);
      if (admin instanceof Response) return admin;

      const user = db.getUser(params.id);
      return user ? HttpResponse.json(user) : errorResponse(404, 'User not found.');
    }),

    http.patch<{ id: string }>(route('/users/:id'), async ({ request, params }) => {
      await simulateLatency();
      const admin = authenticateAdmin(request);
      if (admin instanceof Response) return admin;
      if (!db.getUser(params.id)) return errorResponse(404, 'User not found.');

      const parsed = updateUserSchema.safeParse(await request.json());
      if (!parsed.success) return errorResponse(400, 'Invalid user data.', { issues: parsed.error.issues });

      const input = parsed.data;
      if (db.isEmailTaken(input.email, params.id)) {
        return errorResponse(409, 'This email is already in use.', { field: 'email' });
      }
      if (params.id === admin.id && (input.role !== admin.role || input.status !== admin.status)) {
        return errorResponse(422, 'You cannot change your own role or status.');
      }
      return HttpResponse.json(db.updateUser(params.id, input));
    }),
  ];
}