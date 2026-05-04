import { useState, useEffect, useCallback } from 'react';
import { postsService } from '../services/postsService';
import type { Post, CreatePostPayload, UpdatePostPayload, PostQueryParams } from '../types/post';

interface UsePostsState {
  posts: Post[];
  total: number;
  loading: boolean;
  error: string | null;
}

export function usePosts(params: PostQueryParams = {}) {
  const [state, setState] = useState<UsePostsState>({
    posts: [],
    total: 0,
    loading: false,
    error: null,
  });

  const fetchPosts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { data, meta } = await postsService.getAll(params);
      setState({ posts: data, total: meta.total, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Error al cargar posts',
      }));
    }
  }, [JSON.stringify(params)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = useCallback(async (payload: CreatePostPayload) => {
    const { data } = await postsService.create(payload);
    setState((prev) => ({ ...prev, posts: [data, ...prev.posts], total: prev.total + 1 }));
    return data;
  }, []);

  const updatePost = useCallback(async (id: number, payload: UpdatePostPayload) => {
    const { data } = await postsService.update(id, payload);
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p.id === id ? data : p)),
    }));
    return data;
  }, []);

  const removePost = useCallback(async (id: number) => {
    await postsService.remove(id);
    setState((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== id),
      total: prev.total - 1,
    }));
  }, []);

  return { ...state, refetch: fetchPosts, createPost, updatePost, removePost };
}
