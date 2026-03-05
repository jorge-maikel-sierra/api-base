import { prisma } from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../errors/AppError.js';

/**
 * Obtiene una lista paginada de posts publicados.
 * @param {{ page: number, limit: number, sort: string, order: string }} options
 * @returns {Promise<{ data: object[], meta: object }>}
 */
export const findAll = async ({ page = 1, limit = 20, sort = 'createdAt', order = 'desc' } = {}) => {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: { select: { id: true, username: true } },
      },
      orderBy: { [sort]: order },
    }),
    prisma.post.count(),
  ]);

  return { data: posts, meta: { total, page, limit } };
};

/**
 * Obtiene un post por ID.
 * @param {number} id
 * @returns {Promise<object>}
 */
export const findById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { id: true, username: true } },
    },
  });

  if (!post) {
    throw new NotFoundError('Post no encontrado');
  }

  return post;
};

/**
 * Crea un nuevo post.
 * @param {{ title: string, content: string }} data
 * @param {number} authorId
 * @returns {Promise<object>}
 */
export const createPost = async ({ title, content }, authorId) => {
  const post = await prisma.post.create({
    data: { title, content, authorId },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      author: { select: { id: true, username: true } },
    },
  });

  return post;
};

/**
 * Actualiza completamente un post. Solo el autor puede editarlo.
 * Usa transacción para garantizar que la verificación de autoría y la actualización sean atómicas.
 * @param {number} id
 * @param {{ title: string, content: string }} data
 * @param {number} userId
 * @returns {Promise<object>}
 */
export const updatePost = async (id, { title, content }, userId) => {
  const updated = await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: { id },
      select: { id: true, author: { select: { id: true } } },
    });

    if (!post) {
      throw new NotFoundError('Post no encontrado');
    }

    if (post.author.id !== userId) {
      throw new ForbiddenError('Solo el autor puede editar este post');
    }

    return tx.post.update({
      where: { id },
      data: { title, content },
      select: {
        id: true,
        title: true,
        content: true,
        updatedAt: true,
        author: { select: { id: true, username: true } },
      },
    });
  });

  return updated;
};

/**
 * Elimina un post. Solo el autor puede eliminarlo.
 * Usa transacción para garantizar que la verificación de autoría y el borrado sean atómicos.
 * @param {number} id
 * @param {number} userId
 * @returns {Promise<void>}
 */
export const deletePost = async (id, userId) => {
  await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: { id },
      select: { id: true, author: { select: { id: true } } },
    });

    if (!post) {
      throw new NotFoundError('Post no encontrado');
    }

    if (post.author.id !== userId) {
      throw new ForbiddenError('Solo el autor puede eliminar este post');
    }

    await tx.post.delete({ where: { id } });
  });
};
