import { prisma } from '../../src/config/database.js';
import { registerUser, generateToken } from '../../src/services/authService.js';
import { ConflictError } from '../../src/errors/AppError.js';

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
