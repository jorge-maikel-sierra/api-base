import { prisma } from '../../src/config/database.js';
import { findAll, findById, updateUser, deleteUser } from '../../src/services/usersService.js';
import { NotFoundError } from '../../src/errors/AppError.js';

let userId;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      username: 'svcuser',
      email: 'svcuser@example.com',
      password: 'hashedpassword',
    },
  });
  userId = user.id;
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'svcuser@example.com' } });
  await prisma.$disconnect();
});

describe('usersService.findAll', () => {
  it('debería devolver data y meta con paginación', async () => {
    const result = await findAll({ page: 1, limit: 10 });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta).toMatchObject({ page: 1, limit: 10 });
    expect(typeof result.meta.total).toBe('number');
  });
});

describe('usersService.findById', () => {
  it('debería devolver el usuario correcto', async () => {
    const user = await findById(userId);
    expect(user.id).toBe(userId);
    expect(user.password).toBeUndefined();
  });

  it('debería lanzar NotFoundError si el usuario no existe', async () => {
    await expect(findById(999999)).rejects.toThrow(NotFoundError);
  });
});

describe('usersService.updateUser', () => {
  it('debería actualizar y devolver el usuario actualizado', async () => {
    const updated = await updateUser(userId, { username: 'updateduser' });
    expect(updated.username).toBe('updateduser');
  });

  it('debería lanzar NotFoundError si el usuario no existe', async () => {
    await expect(updateUser(999999, { username: 'x' })).rejects.toThrow(NotFoundError);
  });
});

describe('usersService.deleteUser', () => {
  it('debería eliminar un usuario existente sin errores', async () => {
    const temp = await prisma.user.create({
      data: { username: 'tempuser', email: 'temp@example.com', password: 'hash' },
    });

    await expect(deleteUser(temp.id)).resolves.toBeUndefined();
  });

  it('debería lanzar NotFoundError si el usuario no existe', async () => {
    await expect(deleteUser(999999)).rejects.toThrow(NotFoundError);
  });
});
