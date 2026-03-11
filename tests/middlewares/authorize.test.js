import { jest } from '@jest/globals';
import { authorize } from '../../src/middlewares/authorize';
import { ForbiddenError, UnauthorizedError } from '../../src/errors/index';

const mockNext = jest.fn();

beforeEach(() => {
  mockNext.mockClear();
});

describe('authorize middleware', () => {
  it('debería llamar next() con UnauthorizedError si no hay req.user', () => {
    const req = {};
    const res = {};

    authorize('admin')(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('debería llamar next() con ForbiddenError si el rol no está permitido', () => {
    const req = { user: { role: 'user' } };
    const res = {};

    authorize('admin')(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  it('debería llamar next() sin errores si el rol está permitido', () => {
    const req = { user: { role: 'admin' } };
    const res = {};

    authorize('admin')(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('debería llamar next() sin errores si no se requieren roles específicos', () => {
    const req = { user: { role: 'user' } };
    const res = {};

    authorize()(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('debería permitir acceso con cualquiera de los roles listados', () => {
    const req = { user: { role: 'editor' } };
    const res = {};

    authorize('admin', 'editor')(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });
});
