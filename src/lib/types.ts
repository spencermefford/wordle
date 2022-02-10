import { GameSession as PrismaGameSession } from '@prisma/client';

export type Letter =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

export enum GuessStatus {
  CORRECT = 'CORRECT',
  INCORRECT = 'INCORRECT',
  ALMOST = 'ALMOST',
}

export interface Guess {
  letter: Letter;
  status: GuessStatus;
}

export interface Turn {
  guesses: Guess[];
}

export interface GameSession extends Omit<PrismaGameSession, 'word' | 'turns'> {
  word?: string;
  turns: Turn[];
}
