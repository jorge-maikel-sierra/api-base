import { PrismaClient } from '../../generated/prisma/client.js';

const connectionString =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionString,
    },
  },
});
