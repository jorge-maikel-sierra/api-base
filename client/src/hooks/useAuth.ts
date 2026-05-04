import { useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';
import type { LoginPayload, RegisterPayload } from '../types/auth';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(storage.isAuthenticated);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authService.login(payload);
      storage.setTokens(data.accessToken, data.refreshToken);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      storage.clearTokens();
      setIsAuthenticated(false);
    }
  }, []);

  return { isAuthenticated, loading, error, login, register, logout };
}
