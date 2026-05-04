import type { PaginationParams } from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
}

export interface UserQueryParams extends PaginationParams {
  sort?: 'createdAt' | 'username' | 'email';
}
