import { prisma } from '../../src/config/database.js';
import { registerUser, generateToken, refreshAccessToken } from '../../src/services/authService.js';
import { ConflictError, UnauthorizedError } from '../../src/errors/AppError.js';
import jwt from 'jsonwebtoken';

afterAll(async () => {
  await prisma.$disconnect();
});

describe('authService.registerUser', () => {
  const payload = {
    username: 'serviceuser',
    email: 'serviceuser@example.com',
    password: 'password123',
  };

  afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: payload.email } });
  });

  it('debería crear un usuario y devolver datos sin password', async () => {
    const user = await registerUser(payload);

    expect(user.email).toBe(payload.email);
    expect(user.username).toBe(payload.username);
    expect(user.password).toBeUndefined();
  });

  it('debería lanzar ConflictError si el email ya existe', async () => {
    await registerUser(payload);

    await expect(registerUser(payload)).rejects.toThrow(ConflictError);
  });
});

describe('authService.generateToken', () => {
  const fakeUser = { id: 1, email: 'test@example.com' };

  it('debería devolver un accessToken JWT válido', () => {
    const { accessToken } = generateToken(fakeUser);

    expect(typeof accessToken).toBe('string');
    expect(accessToken.split('.')).toHaveLength(3);
  });

  it('debería devolver un refreshToken JWT válido', () => {
    const { refreshToken } = generateToken(fakeUser);

    expect(typeof refreshToken).toBe('string');
    expect(refreshToken.split('.')).toHaveLength(3);
  });

  it('accessToken y refreshToken deben ser distintos', () => {
    const { accessToken, refreshToken } = generateToken(fakeUser);

    expect(accessToken).not.toBe(refreshToken);
  });
});

describe('authService.refreshAccessToken', () => {
  it('debería lanzar UnauthorizedError si el token es inválido', async () => {
    await expect(refreshAccessToken('token.invalido.xxx')).rejects.toThrow(UnauthorizedError);
  });

  it('debería lanzar UnauthorizedError si el usuario del token ya no existe', async () => {
    // Generar un token con un usuario ficticio que no existe en la BD
    const ghostToken = jwt.sign(
      { sub: 999999 },
      process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );
    await expect(refreshAccessToken(ghostToken)).rejects.toThrow(UnauthorizedError);
  });
});
