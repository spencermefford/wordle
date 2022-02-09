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

  enum TurnStatus {
    CORRECT
    INCORRECT
    ALMOST
  }

  type Guess {
    letter: Letter!
    status: TurnStatus!
  }

  type Turn {
    guesses: [Guess]!
  }

  enum GameStatus {
    PLAYING
    WIN
    LOSS
  }

  type GameState {
    turns: [Turn]!
    status: GameStatus!
  }

  type GameSession {
    id: ID!
    gameState: GameState
    word: String
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
