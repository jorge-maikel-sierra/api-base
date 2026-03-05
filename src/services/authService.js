import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { prisma } from '../config/database.js';
import { ConflictError } from '../errors/AppError.js';

/**
 * Registra un nuevo usuario en la base de datos.
 * @param {{ username: string, email: string, password: string }} data
 * @returns {Promise<{ id: number, username: string, email: string }>}
 */
export const registerUser = async ({ username, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new ConflictError('El email ya está registrado');
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword },
    select: { id: true, username: true, email: true, createdAt: true },
  });

  return user;
};

/**
 * Genera un token JWT para el usuario autenticado.
 * @param {{ id: number, email: string }} user
 * @returns {{ accessToken: string }}
 */
export const generateToken = (user) => {
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '1h' },
  );

  return { accessToken };
};
