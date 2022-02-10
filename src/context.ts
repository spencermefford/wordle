import express from 'express';
import DictionaryDataSource from './datasources/DictionaryDataSource';
// eslint-disable-next-line import/no-cycle
import WordleDataSource from './datasources/WordleDataSource';
import { prisma, PrismaClient } from './lib/prisma';

export interface DataSources {
  wordleDataSource: WordleDataSource;
  dictionaryDataSource: DictionaryDataSource;
}

export interface Context {
  dataSources?: DataSources;
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
