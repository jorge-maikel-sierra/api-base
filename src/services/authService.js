import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { prisma } from '../config/database';
import { ConflictError, UnauthorizedError } from '../errors';

/**
 * Registra un nuevo usuario en la base de datos.
 * Usa transacción para garantizar atomicidad en la verificación + creación.
 * @param {{ username: string, email: string, password: string }} data
 * @returns {Promise<{ id: number, username: string, email: string }>}
 */
export const registerUser = async ({ username, email, password }) => {
  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { email } });

    if (existing) {
      throw new ConflictError('El email ya está registrado');
    }

    return tx.user.create({
      data: { username, email, password: hashedPassword },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });
  });

  return user;
};

/**
 * Genera un access token y un refresh token para el usuario autenticado.
 * @param {{ id: number, email: string }} user
 * @returns {{ accessToken: string, refreshToken: string }}
 */
export const generateToken = (user) => {
  const accessToken = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  });

  const refreshToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d' },
  );

  return { accessToken, refreshToken };
};

/**
 * Verifica un refresh token y genera un nuevo access token.
 * @param {string} refreshToken
 * @returns {{ accessToken: string }}
 */
export const refreshAccessToken = async (refreshToken) => {
  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET);
  } catch {
    throw new UnauthorizedError('Refresh token inválido o expirado');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });

  if (!user) {
    throw new UnauthorizedError('Usuario no encontrado');
  }

  const accessToken = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  });

  return { accessToken };
};
