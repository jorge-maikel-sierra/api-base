import { jest } from '@jest/globals';
import { errorHandler } from '../../src/middlewares/errorHandler';
import { AppError } from '../../src/errors/index';

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('errorHandler middleware', () => {
  const req = {};
  const next = jest.fn();

  it('debería responder con el statusCode y code del AppError', () => {
    const err = new AppError('Error personalizado', 400, 'BAD_REQUEST');
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'Error personalizado', code: 'BAD_REQUEST' },
    });
  });

  it('debería responder con 500 e INTERNAL_ERROR para errores genéricos', () => {
    const err = new Error('Error inesperado');
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'Error interno del servidor', code: 'INTERNAL_ERROR' },
    });
  });

  it('debería ocultar el mensaje real en entorno de producción', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const err = new Error('Detalle interno');
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'Error interno del servidor', code: 'INTERNAL_ERROR' },
    });

    process.env.NODE_ENV = originalEnv;
  });
});
