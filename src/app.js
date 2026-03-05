import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import passport from './config/passport.js';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import apiRouter from './routes/index.js';

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
      } else {
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

// Passport (sin sesión, usamos JWT)
app.use(passport.initialize());

// currentUser global
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Swagger UI (solo en entornos no productivos)
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
