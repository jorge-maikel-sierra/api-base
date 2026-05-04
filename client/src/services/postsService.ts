import { api } from './api';
import type { ApiResponse, PaginatedResponse } from '../types/api';
import type {
  Post,
  CreatePostPayload,
  UpdatePostPayload,
  PostQueryParams,
} from '../types/post';

const buildQuery = (params: PostQueryParams): string => {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  if (params.sort) q.set('sort', params.sort);
  if (params.order) q.set('order', params.order);
  return q.toString() ? `?${q.toString()}` : '';
};

export const postsService = {
  getAll: (params: PostQueryParams = {}) =>
    api.get<PaginatedResponse<Post>>(`/posts${buildQuery(params)}`, false),

  getById: (id: number) =>
    api.get<ApiResponse<Post>>(`/posts/${id}`, false),

  create: (payload: CreatePostPayload) =>
    api.post<ApiResponse<Post>>('/posts', payload),

  update: (id: number, payload: UpdatePostPayload) =>
    api.put<ApiResponse<Post>>(`/posts/${id}`, payload),

  remove: (id: number) =>
    api.delete<void>(`/posts/${id}`),
};
