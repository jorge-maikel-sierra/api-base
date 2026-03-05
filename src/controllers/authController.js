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
 * Devuelve un token JWT para el usuario autenticado por Passport.
 */
export const login = (req, res) => {
  const { accessToken } = authService.generateToken(req.user);
  return res.status(200).json({ data: { accessToken } });
};
