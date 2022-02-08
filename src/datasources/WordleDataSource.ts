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

type GameSessionWithState = GameSession & { gameState: GameState };

const MAX_TURNS = 6;

export default class WordleDataSource<
  TContext extends Context,
> extends DataSource {
  context!: TContext;

  override initialize(config: DataSourceConfig<TContext>): void {
    this.context = config.context;
  }

  async createGameSession(): Promise<GameSessionWithState> {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const session = await this.context.prisma.gameSession.create({
      data: {
        word: randomWord,
        gameState: {
          turns: [],
          status: GameStatus.PLAYING,
        },
      },
    });
    return session as GameSessionWithState;
  }

  async findGameSession(id: string): Promise<GameSessionWithState> {
    const session = await this.context.prisma.gameSession.findFirst({
      where: { id },
    });
    return session as GameSessionWithState;
  }

  async updateGameSession(
    id: string,
    gameState: GameState,
  ): Promise<GameSessionWithState> {
    const session = await this.context.prisma.gameSession.update({
      where: { id },
      data: { gameState },
    });
    return session as GameSessionWithState;
  }

  async playGame(guess: Letter[]): Promise<GameSessionWithState> {
    const session = await this.findGameSession(this.context.sessionId);
    const { gameState, word: currentWord } = session;
    // Don't keep playing if we're done
    if (gameState.status !== GameStatus.PLAYING) return session;

    if (gameState.turns.length >= MAX_TURNS)
      throw new Error(`You can only play ${MAX_TURNS} turns.`);

    const turnGuesses = guess.map<Guess>((letter, i) => {
      let status: TurnStatus;
      if (currentWord.charAt(i) === letter) status = TurnStatus.CORRECT;
      else if (currentWord.includes(letter)) status = TurnStatus.ALMOST;
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

    return this.updateGameSession(session.id, gameState);
  }
}
