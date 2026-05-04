import { api } from './api';
import type { ApiResponse } from '../types/api';
import type {
  LoginPayload,
  RegisterPayload,
  AuthTokens,
  RefreshPayload,
} from '../types/auth';
import type { User } from '../types/user';

export const authService = {
  register: (payload: RegisterPayload) =>
    api.post<ApiResponse<User>>('/auth/register', payload, false),

  login: (payload: LoginPayload) =>
    api.post<ApiResponse<AuthTokens>>('/auth/login', payload, false),

  refresh: (payload: RefreshPayload) =>
    api.post<ApiResponse<AuthTokens>>('/auth/refresh', payload, false),

  logout: () => api.post<void>('/auth/logout', {}),
};
