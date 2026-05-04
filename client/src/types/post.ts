import type { User } from './user';
import type { PaginationParams } from './api';

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author: Pick<User, 'id' | 'username'>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
}

export interface UpdatePostPayload {
  title: string;
  content: string;
}

export interface PostQueryParams extends PaginationParams {
  sort?: 'createdAt' | 'title';
}
