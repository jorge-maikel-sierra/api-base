import { PrismaClient } from 'prisma-client-d830865669de0f714a9499e7134522abfb0e6df281ea83ff77c162a1b3e56808';

const connectionString =
  process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

// connection_limit: número máximo de conexiones en el pool (configurable por env).
// pool_timeout: segundos de espera antes de lanzar error si el pool está lleno.
const url = new URL(connectionString);
url.searchParams.set('connection_limit', process.env.DB_POOL_SIZE ?? '10');
url.searchParams.set('pool_timeout', process.env.DB_POOL_TIMEOUT ?? '30');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: url.toString(),
    },
  },
});

export { prisma };
export default prisma;
