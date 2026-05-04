import { api } from './api';
import type { ApiResponse, PaginatedResponse } from '../types/api';
import type { User, UpdateUserPayload, UserQueryParams } from '../types/user';

const buildQuery = (params: UserQueryParams): string => {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  if (params.sort) q.set('sort', params.sort);
  if (params.order) q.set('order', params.order);
  return q.toString() ? `?${q.toString()}` : '';
};

export const usersService = {
  getAll: (params: UserQueryParams = {}) =>
    api.get<PaginatedResponse<User>>(`/users${buildQuery(params)}`),

  getById: (id: number) =>
    api.get<ApiResponse<User>>(`/users/${id}`),

  update: (id: number, payload: UpdateUserPayload) =>
    api.patch<ApiResponse<User>>(`/users/${id}`, payload),

  remove: (id: number) =>
    api.delete<void>(`/users/${id}`),
};
