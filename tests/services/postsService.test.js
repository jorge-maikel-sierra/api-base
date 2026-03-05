import { prisma } from '../../src/config/database.js';
import {
  findAll,
  findById,
  createPost,
  updatePost,
  deletePost,
} from '../../src/services/postsService.js';
import { NotFoundError, ForbiddenError } from '../../src/errors/AppError.js';

let author;
let postId;

beforeAll(async () => {
  author = await prisma.user.create({
    data: {
      username: 'postowner',
      email: 'postowner@example.com',
      password: 'hashedpassword',
    },
  });

  const post = await prisma.post.create({
    data: { title: 'Test post', content: 'Test content', authorId: author.id },
  });
  postId = post.id;
});

afterAll(async () => {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany({ where: { email: 'postowner@example.com' } });
  await prisma.$disconnect();
});

describe('postsService.findAll', () => {
  it('debería devolver data y meta paginados', async () => {
    const result = await findAll({ page: 1, limit: 10 });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta).toMatchObject({ page: 1, limit: 10 });
  });

  it('debería usar valores por defecto si se llama sin argumentos', async () => {
    const result = await findAll();

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta).toMatchObject({ page: 1, limit: 20 });
  });
});

describe('postsService.findById', () => {
  it('debería devolver el post correcto con su autor', async () => {
    const post = await findById(postId);
    expect(post.id).toBe(postId);
    expect(post.author).toBeDefined();
  });

  it('debería lanzar NotFoundError si el post no existe', async () => {
    await expect(findById(999999)).rejects.toThrow(NotFoundError);
  });
});

describe('postsService.createPost', () => {
  it('debería crear un post y devolverlo', async () => {
    const post = await createPost({ title: 'Nuevo', content: 'Contenido' }, author.id);
    expect(post.title).toBe('Nuevo');
    expect(post.author.id).toBe(author.id);
  });
});

describe('postsService.updatePost', () => {
  it('debería actualizar el post si el usuario es el autor', async () => {
    const updated = await updatePost(postId, { title: 'Actualizado', content: 'Nuevo contenido' }, author.id);
    expect(updated.title).toBe('Actualizado');
  });

  it('debería lanzar ForbiddenError si el usuario no es el autor', async () => {
    await expect(
      updatePost(postId, { title: 'X', content: 'X' }, 999999),
    ).rejects.toThrow(ForbiddenError);
  });

  it('debería lanzar NotFoundError si el post no existe', async () => {
    await expect(
      updatePost(999999, { title: 'X', content: 'X' }, author.id),
    ).rejects.toThrow(NotFoundError);
  });
});

describe('postsService.deletePost', () => {
  let deletePostId;

  beforeEach(async () => {
    const p = await prisma.post.create({
      data: { title: 'Para borrar', content: 'Contenido', authorId: author.id },
    });
    deletePostId = p.id;
  });

  afterEach(async () => {
    await prisma.post.deleteMany({ where: { id: deletePostId } }).catch(() => {});
  });

  it('debería lanzar ForbiddenError si el usuario no es el autor', async () => {
    await expect(deletePost(deletePostId, 999999)).rejects.toThrow(ForbiddenError);
  });

  it('debería eliminar el post si el usuario es el autor', async () => {
    await expect(deletePost(deletePostId, author.id)).resolves.toBeUndefined();
  });
});
