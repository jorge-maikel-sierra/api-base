import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from '../../src/errors/index.js';

describe('errors index exports', () => {
  it('debe exportar todas las clases de error', () => {
    expect(AppError).toBeDefined();
    expect(NotFoundError).toBeDefined();
    expect(ValidationError).toBeDefined();
    expect(UnauthorizedError).toBeDefined();
    expect(ForbiddenError).toBeDefined();
    expect(ConflictError).toBeDefined();
  });

  it('ValidationError instancia tiene propiedades por defecto', () => {
    const v = new ValidationError();
    expect(v.statusCode).toBe(422);
    expect(v.code).toBe('VALIDATION_ERROR');
    expect(v.message).toBe('Error de validación');
  });
});
