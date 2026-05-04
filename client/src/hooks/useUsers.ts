import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../services/usersService';
import type { User, UpdateUserPayload, UserQueryParams } from '../types/user';

interface UseUsersState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
}

export function useUsers(params: UserQueryParams = {}) {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    total: 0,
    loading: false,
    error: null,
  });

  const fetchUsers = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { data, meta } = await usersService.getAll(params);
      setState({ users: data, total: meta.total, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Error al cargar usuarios',
      }));
    }
  }, [JSON.stringify(params)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: number, payload: UpdateUserPayload) => {
    const { data } = await usersService.update(id, payload);
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === id ? data : u)),
    }));
    return data;
  }, []);

  const removeUser = useCallback(async (id: number) => {
    await usersService.remove(id);
    setState((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== id),
      total: prev.total - 1,
    }));
  }, []);

  return { ...state, refetch: fetchUsers, updateUser, removeUser };
}
