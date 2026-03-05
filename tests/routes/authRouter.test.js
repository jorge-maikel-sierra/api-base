import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/config/database.js';

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /api/v1/auth/register', () => {
  const endpoint = '/api/v1/auth/register';
  const validPayload = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
  };

  afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: validPayload.email } });
  });

  it('debería registrar un usuario y devolver 201', async () => {
    const res = await request(app).post(endpoint).send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      username: validPayload.username,
      email: validPayload.email,
    });
    expect(res.body.data.password).toBeUndefined();
  });

  it('debería devolver 422 si el email es inválido', async () => {
    const res = await request(app)
      .post(endpoint)
      .send({ ...validPayload, email: 'no-es-un-email' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('debería devolver 422 si la contraseña tiene menos de 8 caracteres', async () => {
    const res = await request(app)
      .post(endpoint)
      .send({ ...validPayload, password: 'corta' });

    expect(res.status).toBe(422);
  });

  it('debería devolver 409 si el email ya está registrado', async () => {
    await request(app).post(endpoint).send(validPayload);
    const res = await request(app).post(endpoint).send(validPayload);

    expect(res.status).toBe(409);
  });
});

describe('POST /api/v1/auth/login', () => {
  const endpoint = '/api/v1/auth/login';
  const registerPayload = {
    username: 'loginuser',
    email: 'loginuser@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    await request(app).post('/api/v1/auth/register').send(registerPayload);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: registerPayload.email } });
  });

  it('debería devolver 200 y un access token con credenciales correctas', async () => {
    const res = await request(app).post(endpoint).send({
      email: registerPayload.email,
      password: registerPayload.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('debería devolver 401 con credenciales incorrectas', async () => {
    const res = await request(app).post(endpoint).send({
      email: registerPayload.email,
      password: 'contraseña_incorrecta',
    });

    expect(res.status).toBe(401);
  });

  it('debería devolver 422 si el email está vacío', async () => {
    const res = await request(app).post(endpoint).send({ password: 'password123' });

    expect(res.status).toBe(422);
  });
});
