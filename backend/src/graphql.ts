import { gql } from 'apollo-server-express';
import { IResolvers } from '@graphql-tools/utils';

export const typeDefs = gql`
  type Query {
    gameSession: GameSession!
  }

  type Mutation {
    playGame(guess: [Letter]!): GameSession!
  }

  enum Letter {
    A
    B
    C
    D
    E
    F
    G
    H
    I
    J
    K
    L
    M
    N
    O
    P
    Q
    R
    S
    T
    U
    V
    W
    X
    Y
    Z
  }

  enum GuessStatus {
    CORRECT
    INCORRECT
    ALMOST
  }

  type Guess {
    letter: Letter!
    status: GuessStatus!
  }

  enum GameStatus {
    ACTIVE
    COMPLETE
  }

  enum GameResult {
    WINNER
    LOSER
  }

  type Turn {
    guesses: [Guess]
  }

  type GameSession {
    id: ID!
    word: String
    status: GameStatus!
    result: GameResult
    turns: [Turn]
  }
`;

export const resolvers: IResolvers = {
  Query: {
    gameSession: async (_, _args, { dataSources, sessionId }) => {
      return dataSources.wordleDataSource.findOrCreateGameSession(sessionId);
    },
  },
  Mutation: {
    playGame: async (_, { guess }, { dataSources }) => {
      return dataSources.wordleDataSource.playGame(guess);
    },
  },
};
