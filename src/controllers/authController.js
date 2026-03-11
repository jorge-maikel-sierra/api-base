import { matchedData } from 'express-validator';
import * as authService from '../services/authService.js';

/**
 * POST /api/v1/auth/register
 * Registra un nuevo usuario.
 */
export const register = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const user = await authService.registerUser(data);
    return res.status(201).json({ data: user });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/v1/auth/login
 * Devuelve access token y refresh token para el usuario autenticado por Passport.
 */
export const login = (req, res) => {
  const { accessToken, refreshToken } = authService.generateToken(req.user);
  return res.status(200).json({ data: { accessToken, refreshToken } });
};

/**
 * POST /api/v1/auth/refresh
 * Emite un nuevo access token a partir de un refresh token válido.
 */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = matchedData(req);
    const tokens = await authService.refreshAccessToken(refreshToken);
    return res.status(200).json({ data: tokens });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/v1/auth/logout
 * Con JWT stateless el logout se gestiona en el cliente eliminando el token.
 * Este endpoint confirma la operación y puede extenderse con una lista negra.
 */
export function logout(req, res) {
  // JWT es stateless: el cliente debe descartar el token.
  // Para invalidación server-side, implementar una blocklist en Redis.
  return res.status(200).json({ data: { message: 'Sesión cerrada correctamente' } });
}
