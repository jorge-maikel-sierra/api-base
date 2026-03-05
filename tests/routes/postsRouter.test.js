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
