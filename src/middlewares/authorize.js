import { ForbiddenError, UnauthorizedError } from '../errors/AppError.js';

/**
 * Middleware de autorización independiente del de autenticación.
 * Debe usarse DESPUÉS de `authenticate`.
 *
 * Uso:
 *   router.delete('/:id', authenticate, authorize('admin'), controller.remove)
 *   router.patch('/:id', authenticate, authorize('admin', 'editor'), controller.update)
 *
 * @param {...string} roles - Roles permitidos para acceder al recurso.
 * @returns {Function} Middleware de Express
 */
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('Debes iniciar sesión para acceder a este recurso'));
  }

  if (roles.length > 0 && !roles.includes(req.user.role)) {
    return next(new ForbiddenError('No tienes permiso para realizar esta acción'));
  }

  return next();
};
