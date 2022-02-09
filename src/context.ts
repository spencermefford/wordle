import express from 'express';
import { prisma, PrismaClient } from './lib/prisma';

export interface Context {
  sessionId: string;
  prisma: PrismaClient;
}

export const context = ({ req }: { req: express.Request }): Context => {
  const sessionHeader = req.headers.sesh;
  const sessionId = Array.isArray(sessionHeader)
    ? sessionHeader[0]
    : sessionHeader;

  return { sessionId: sessionId ?? '', prisma };
};
