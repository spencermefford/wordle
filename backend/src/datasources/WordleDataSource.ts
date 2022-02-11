/* eslint-disable class-methods-use-this */
import {
  Prisma,
  GameResult,
  GameSession as PrismaGameSession,
  GameStatus,
} from '@prisma/client';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
// eslint-disable-next-line import/no-cycle
import { Context } from '../context';
import { GameSession, Guess, GuessStatus, Letter } from '../lib/types';
import words from '../lib/words';

const MAX_TURNS = 6;

export default class WordleDataSource extends DataSource {
  context!: Context;

  override initialize(config: DataSourceConfig<Context>): void {
    this.context = config.context;
  }

  async findOrCreateGameSession(id?: string): Promise<PrismaGameSession> {
    if (id) {
      const session = await this.findGameSession(id);
      if (session) return session;
    }

    return this.createGameSession();
  }

  async findGameSession(id: string): Promise<PrismaGameSession | null> {
    return this.context.prisma.gameSession.findFirst({
      where: { id },
    });
  }

  async createGameSession(): Promise<PrismaGameSession> {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return this.context.prisma.gameSession.create({
      data: {
        word: randomWord,
      },
    });
  }

  async playGame(letters: Letter[]): Promise<GameSession> {
    const sessionUpdates: Partial<GameSession> = {};
    const session = (await this.findGameSession(
      this.context.sessionId,
    )) as unknown as GameSession;
    const { status, turns, word: currentWord } = session;

    // Don't keep playing if we're done
    if (status !== GameStatus.ACTIVE) return session;

    // You can't play more than 6 times
    if (turns.length >= MAX_TURNS)
      throw new Error(`You can only play ${MAX_TURNS} turns.`);

    // Build the guesses response
    const guesses = letters.map<Guess>((letter, i) => {
      let guessStatus: GuessStatus;
      if (currentWord?.charAt(i) === letter) {
        guessStatus = GuessStatus.CORRECT;
      } else if (currentWord?.includes(letter)) {
        guessStatus = GuessStatus.ALMOST;
      } else {
        guessStatus = GuessStatus.INCORRECT;
      }

      return { letter, status: guessStatus };
    });

    // Is the game over?
    const isWinner = guesses.every((g) => g.status === GuessStatus.CORRECT);
    const isLastTurn = turns.length === MAX_TURNS - 1;
    if (isWinner || isLastTurn) {
      sessionUpdates.status = GameStatus.COMPLETE;
      sessionUpdates.result = isWinner ? GameResult.WINNER : GameResult.LOSER;
    }

    const updatedSession = (await this.context.prisma.gameSession.update({
      where: { id: session.id },
      data: {
        ...sessionUpdates,
        turns: [...turns, { guesses }] as unknown as Prisma.JsonArray,
      },
    })) as unknown as GameSession;

    // Don't show the word until the game is over
    if (updatedSession.status === GameStatus.ACTIVE) delete updatedSession.word;

    return updatedSession;
  }
}
