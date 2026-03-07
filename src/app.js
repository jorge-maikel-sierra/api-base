import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import passport from './config/passport';
import swaggerSpec from './config/swagger';
import { errorHandler } from './middlewares/errorHandler';
import apiRouter from './routes/index';

const app = express();

// Seguridad — primer middleware
app.use(helmet());

// CORS con whitelist explícita
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else /* istanbul ignore next */ {
        callback(new Error('Origen no permitido por CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Logger HTTP (solo en entornos no productivos)
if (process.env.NODE_ENV !== 'production') {
  app.use(pinoHttp());
}

// Parseo de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sesión (necesaria para Passport y CSRF futuro). JWT es el mecanismo primario de auth.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  }),
);

// Rate limiting en endpoints de autenticación (prevenir fuerza bruta)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Demasiadas solicitudes, intenta de nuevo en 15 minutos',
      code: 'TOO_MANY_REQUESTS',
    },
  },
});
app.use('/api/v1/auth', authRateLimiter);

// Passport (sin sesión, usamos JWT)
app.use(passport.initialize());

// currentUser global
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Swagger UI (solo en entornos no productivos)
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Rutas versionadas
app.use('/api/v1', apiRouter);

// Ruta 404 para rutas no definidas
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Ruta no encontrada', code: 'NOT_FOUND' } });
});

// Middleware global de errores — siempre al final
app.use(errorHandler);

export default app;
