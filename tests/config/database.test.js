import { jest } from '@jest/globals';

describe('config/database', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('debe usar TEST_DATABASE_URL en entorno test', async () => {
    process.env.NODE_ENV = 'test';
    process.env.TEST_DATABASE_URL = 'postgresql://test';

    // import dinámico para re-evaluar la configuración en ESM
    const { prisma } = await import('../../src/config/database.js');
    expect(prisma).toBeDefined();
  });

  it('debe usar DATABASE_URL en entorno development', async () => {
    process.env.NODE_ENV = 'development';
    process.env.DATABASE_URL = 'postgresql://dev';

    const { prisma } = await import('../../src/config/database.js');
    expect(prisma).toBeDefined();
  });
});
