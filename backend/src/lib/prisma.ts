import pkg, { PrismaClient } from '@prisma/client';

// eslint-disable-next-line import/no-mutable-exports
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  const { PrismaClient: PrismaClientProd } = pkg;
  prisma = new PrismaClientProd();
} else {
  prisma = new PrismaClient();
}

export { prisma, PrismaClient };
