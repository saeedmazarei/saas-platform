import { paginatedSchema, userSchema, type ListUsersParams, type UpdateUserInput } from '@saas/domain';
import { request } from '../http';

const usersListSchema = paginatedSchema(userSchema);

export function getUsersList(params: ListUsersParams, signal?: AbortSignal) {
  return request.get('/users', { params, schema: usersListSchema, signal });
}

export function getUser(id: string, signal?: AbortSignal) {
  return request.get(`/users/${encodeURIComponent(id)}`, { schema: userSchema, signal });
}

export function updateUser(id: string, body: UpdateUserInput) {
  return request.patch(`/users/${encodeURIComponent(id)}`, body, { schema: userSchema });
}
