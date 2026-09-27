import { userSchema, type UpdateProfileInput } from '@saas/domain';
import { request } from '../http';

export function getMyProfile(signal?: AbortSignal) {
  return request.get('/me', { schema: userSchema, signal });
}

export function updateMyProfile(body: UpdateProfileInput) {
  return request.patch('/me', body, { schema: userSchema });
}