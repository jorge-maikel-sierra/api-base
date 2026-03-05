import 'dotenv/config';
import app from './src/app.js';

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  // pino logger se encarga del logging en producción
  // eslint-disable-next-line no-console
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
