/* eslint-disable class-methods-use-this */
import { DataSource } from 'apollo-datasource';
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

const MAX_TURNS = 6;

const currentWord = words[0]; // TODO: Eventually get from DB/GameState

const gameState: GameState = {
  turns: [],
  status: GameStatus.PLAYING,
}; // TODO: Get from DB using session token

export default class WordleDataSource extends DataSource {
  async playGame(guess: Letter[]) {
    // Don't keep playing if we're done
    if (gameState.status !== GameStatus.PLAYING) return gameState;

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

    return gameState;
  }
}
