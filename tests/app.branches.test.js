import { jest } from '@jest/globals';

describe('app branches por NODE_ENV', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('debe importar app en modo production (sin middlewares de dev)', async () => {
    process.env.NODE_ENV = 'production';

    const mod = await import('../src/app.js');
    expect(mod.default).toBeDefined();
  });

  it('debe importar app en modo test (con middlewares de dev)', async () => {
    process.env.NODE_ENV = 'test';

    const mod = await import('../src/app.js');
    expect(mod.default).toBeDefined();
  });
});
