import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/config/database.js';
import * as authService from '../../src/services/authService.js';

let token;
let userId;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      username: 'userstest',
      email: 'userstest@example.com',
      password: '$2a$10$abcdefghijklmnopqrstuuVGmYiJtZ7Vd5/WUjbDQtM5Lk0v.mCy',
    },
  });
  userId = user.id;
  ({ accessToken: token } = authService.generateToken(user));
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'userstest@example.com' } });
  await prisma.$disconnect();
});

describe('GET /api/v1/users', () => {
  it('debería devolver 200 con lista de usuarios autenticado', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta).toMatchObject({ page: 1, limit: 20 });
  });

  it('debería devolver 401 sin token', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(401);
  });

  it('debería devolver 422 con page inválido', async () => {
    const res = await request(app)
      .get('/api/v1/users?page=abc')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(422);
  });
});

describe('GET /api/v1/users/:id', () => {
  it('debería devolver 200 con el usuario correcto', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(userId);
  });

  it('debería devolver 404 si el usuario no existe', async () => {
    const res = await request(app)
      .get('/api/v1/users/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('debería devolver 401 sin token', async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`);
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/v1/users/:id', () => {
  it('debería devolver 204 al eliminar un usuario existente', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'todelete',
        email: 'todelete@example.com',
        password: 'hashedpass',
      },
    });

    const res = await request(app)
      .delete(`/api/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it('debería devolver 404 si el usuario no existe', async () => {
    const res = await request(app)
      .delete('/api/v1/users/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
