import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/config/database.js';
import * as authService from '../../src/services/authService.js';

let token;
let postId;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      username: 'postauthor',
      email: 'postauthor@example.com',
      password: '$2a$10$abcdefghijklmnopqrstuuVGmYiJtZ7Vd5/WUjbDQtM5Lk0v.mCy',
    },
  });
  ({ accessToken: token } = authService.generateToken(user));

  const post = await prisma.post.create({
    data: { title: 'Post de prueba', content: 'Contenido de prueba', authorId: user.id },
  });
  postId = post.id;
});

afterAll(async () => {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany({ where: { email: 'postauthor@example.com' } });
  await prisma.$disconnect();
});

describe('GET /api/v1/posts', () => {
  it('debería devolver 200 con lista de posts', async () => {
    const res = await request(app).get('/api/v1/posts');

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta).toMatchObject({ page: 1, limit: 20 });
  });

  it('debería devolver 422 con limit inválido', async () => {
    const res = await request(app).get('/api/v1/posts?limit=abc');
    expect(res.status).toBe(422);
  });
});

describe('GET /api/v1/posts/:id', () => {
  it('debería devolver 200 con el post correcto', async () => {
    const res = await request(app).get(`/api/v1/posts/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(postId);
  });

  it('debería devolver 404 si el post no existe', async () => {
    const res = await request(app).get('/api/v1/posts/999999');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/v1/posts', () => {
  it('debería devolver 201 al crear un post autenticado', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Nuevo post', content: 'Contenido nuevo' });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Nuevo post');
  });

  it('debería devolver 401 sin token', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .send({ title: 'Post', content: 'Contenido' });

    expect(res.status).toBe(401);
  });

  it('debería devolver 422 si faltan campos requeridos', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });

    expect(res.status).toBe(422);
  });
});

describe('PUT /api/v1/posts/:id', () => {
  it('debería devolver 200 al actualizar un post como autor', async () => {
    const res = await request(app)
      .put(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Título actualizado', content: 'Contenido actualizado' });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Título actualizado');
  });

  it('debería devolver 401 sin token', async () => {
    const res = await request(app)
      .put(`/api/v1/posts/${postId}`)
      .send({ title: 'Título', content: 'Contenido' });

    expect(res.status).toBe(401);
  });

  it('debería devolver 422 si el título está vacío', async () => {
    const res = await request(app)
      .put(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '', content: 'Contenido' });

    expect(res.status).toBe(422);
  });

  it('debería devolver 422 si el contenido está vacío', async () => {
    const res = await request(app)
      .put(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Título', content: '' });

    expect(res.status).toBe(422);
  });

  it('debería devolver 403 si el usuario no es el autor', async () => {
    const otherUser = await prisma.user.create({
      data: {
        username: 'otheruserput',
        email: 'otheruserput@example.com',
        password: '$2a$10$abcdefghijklmnopqrstuuVGmYiJtZ7Vd5/WUjbDQtM5Lk0v.mCy',
      },
    });
    const { accessToken: otherToken } = authService.generateToken(otherUser);

    const res = await request(app)
      .put(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Intento', content: 'No autorizado' });

    await prisma.user.delete({ where: { id: otherUser.id } });

    expect(res.status).toBe(403);
  });

  it('debería devolver 404 si el post no existe', async () => {
    const res = await request(app)
      .put('/api/v1/posts/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Título', content: 'Contenido' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/v1/posts/:id', () => {
  let deletePostId;

  beforeEach(async () => {
    const post = await prisma.post.create({
      data: {
        title: 'Post a eliminar',
        content: 'Contenido temporal',
        authorId: (await prisma.user.findUnique({ where: { email: 'postauthor@example.com' } })).id,
      },
    });
    deletePostId = post.id;
  });

  afterEach(async () => {
    await prisma.post.deleteMany({ where: { id: deletePostId } }).catch(() => {});
  });

  it('debería devolver 204 al eliminar un post como autor', async () => {
    const res = await request(app)
      .delete(`/api/v1/posts/${deletePostId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it('debería devolver 401 sin token', async () => {
    const res = await request(app).delete(`/api/v1/posts/${deletePostId}`);

    expect(res.status).toBe(401);
  });

  it('debería devolver 403 si el usuario no es el autor', async () => {
    const otherUser = await prisma.user.create({
      data: {
        username: 'otheruserdel',
        email: 'otheruserdel@example.com',
        password: '$2a$10$abcdefghijklmnopqrstuuVGmYiJtZ7Vd5/WUjbDQtM5Lk0v.mCy',
      },
    });
    const { accessToken: otherToken } = authService.generateToken(otherUser);

    const res = await request(app)
      .delete(`/api/v1/posts/${deletePostId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    await prisma.user.delete({ where: { id: otherUser.id } });

    expect(res.status).toBe(403);
  });

  it('debería devolver 404 si el post no existe', async () => {
    const res = await request(app)
      .delete('/api/v1/posts/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
