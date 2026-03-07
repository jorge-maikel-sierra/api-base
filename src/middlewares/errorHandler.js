import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });

/**
 * Middleware global de errores (4 parámetros).
 * Debe registrarse al final de todos los middlewares en app.js.
 */
export default function errorHandler(err, req, res) {
  const statusCode = err.statusCode ?? 500;
  const message = err.statusCode ? err.message : 'Error interno del servidor';

  if (process.env.NODE_ENV !== 'production') {
    logger.error(err.stack);
  } else {
    logger.error({ statusCode, message: err.message, code: err.code });
  }

  res.status(statusCode).json({
    error: {
      message,
      code: err.code ?? 'INTERNAL_ERROR',
    },
  });
}
