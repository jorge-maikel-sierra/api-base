import prisma from '../config/database';
import { NotFoundError } from '../errors';

/**
 * Obtiene una lista paginada de usuarios.
 * @param {{ page: number, limit: number, sort: string, order: string }} options
 * @returns {Promise<{ data: object[], meta: { total: number, page: number, limit: number } }>}
 */
export const findAll = async ({
  page = 1, limit = 20, sort = 'createdAt', order = 'desc',
} = {}) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true, username: true, email: true, createdAt: true,
      },
      orderBy: { [sort]: order },
    }),
    prisma.user.count(),
  ]);

  return { data: users, meta: { total, page, limit } };
};

/**
 * Obtiene un usuario por ID.
 * @param {number} id
 * @returns {Promise<object>}
 */
export const findById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, username: true, email: true, createdAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  return user;
};

/**
 * Actualiza parcialmente un usuario.
 * @param {number} id
 * @param {{ username?: string, email?: string }} data
 * @returns {Promise<object>}
 */
export const updateUser = async (id, data) => {
  await findById(id);

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true, username: true, email: true, createdAt: true,
    },
  });

  return updated;
};

/**
 * Elimina un usuario por ID.
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  await findById(id);
  await prisma.user.delete({ where: { id } });
};
