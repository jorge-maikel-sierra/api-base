import passport from '../config/passport.js';
import { UnauthorizedError } from '../errors/index.js';

/**
 * Middleware que verifica el token JWT mediante Passport JWTStrategy.
 * Responde 401 si el token es inválido o está ausente.
 */
export default function authenticate(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      return next(new UnauthorizedError('Token inválido o expirado'));
    }

    req.user = user;
    return next();
  })(req, res, next);
}
