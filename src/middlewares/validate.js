import { validationResult } from 'express-validator';

/**
 * Middleware que ejecuta validationResult() y responde 422 si hay errores.
 * Debe encadenarse después de los validadores de express-validator.
 */
export default function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: {
        message: 'Error de validación',
        code: 'VALIDATION_ERROR',
        details: errors.array(),
      },
    });
  }

  return next();
}
