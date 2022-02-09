/* eslint-disable class-methods-use-this */
import { GameSession } from '@prisma/client';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Context } from '../context';
import words from '../lib/words';

type Letter =
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

enum TurnStatus {
  CORRECT = 'CORRECT',
  INCORRECT = 'INCORRECT',
  ALMOST = 'ALMOST',
}

type Guess = {
  letter: Letter;
  status: TurnStatus;
};

type Turn = {
  guesses: Guess[];
};

enum GameStatus {
  PLAYING = 'PLAYING',
  WIN = 'WIN',
  LOSS = 'LOSS',
}

type GameState = {
  turns: Turn[];
  status: GameStatus;
};

interface GameSessionWithState extends Omit<GameSession, 'word'> {
  gameState: GameState;
  word?: string;
}

const MAX_TURNS = 6;

export default class WordleDataSource<
  TContext extends Context,
> extends DataSource {
  context!: TContext;

  override initialize(config: DataSourceConfig<TContext>): void {
    this.context = config.context;
  }

  async findOrCreateGameSession(id?: string): Promise<GameSession> {
    if (id) {
      const session = await this.findGameSession(id);
      if (session) return session;
    }

    return this.createGameSession();
  }

  async findGameSession(id: string): Promise<GameSession | null> {
    return this.context.prisma.gameSession.findFirst({
      where: { id },
    });
  }

  async createGameSession(): Promise<GameSession> {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return this.context.prisma.gameSession.create({
      data: {
        word: randomWord,
        gameState: {
          turns: [],
          status: GameStatus.PLAYING,
        },
      },
    });
  }

  async updateGameSession(
    id: string,
    gameState: GameState,
  ): Promise<GameSession> {
    return this.context.prisma.gameSession.update({
      where: { id },
      data: { gameState },
    });
  }

  async playGame(guess: Letter[]): Promise<GameSessionWithState> {
    const session = (await this.findGameSession(
      this.context.sessionId,
    )) as GameSessionWithState;
    const { gameState, word: currentWord } = session;

    // Don't keep playing if we're done
    if (gameState.status !== GameStatus.PLAYING) return session;

    if (gameState.turns.length >= MAX_TURNS)
      throw new Error(`You can only play ${MAX_TURNS} turns.`);

    const turnGuesses = guess.map<Guess>((letter, i) => {
      let status: TurnStatus;
      if (currentWord?.charAt(i) === letter) status = TurnStatus.CORRECT;
      else if (currentWord?.includes(letter)) status = TurnStatus.ALMOST;
      else status = TurnStatus.INCORRECT;

      return { letter, status };
    });

    gameState.turns = [...gameState.turns, { guesses: turnGuesses }];

    const isWinner = turnGuesses.every(
      ({ status }) => status === TurnStatus.CORRECT,
    );
    if (isWinner) gameState.status = GameStatus.WIN;
    else if (gameState.turns.length >= MAX_TURNS)
      gameState.status = GameStatus.LOSS;

    const updatedSession = (await this.updateGameSession(
      session.id,
      gameState,
    )) as GameSessionWithState;
    if (gameState.status === GameStatus.PLAYING) delete updatedSession.word;

    return updatedSession;
  }
}
