import { sessionSchema, userSchema, type LoginInput } from '@saas/domain';
import { request } from '../http';

export function login(body: LoginInput) {
  return request.post('/auth/login', body, { schema: sessionSchema, skipAuthRedirect: true });
}

export function logout() {
  return request.post('/auth/logout');
}

export function getMe(signal?: AbortSignal) {
  return request.get('/me', { schema: userSchema, signal });
}