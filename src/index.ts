import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { IResolvers } from '@graphql-tools/utils';
import WordleDataSource from './datasources/WordleDataSource';
import DictionaryDataSource from './datasources/DictionaryDataSource';

const typeDefs = gql`
  type Query {
    playGame(guess: [Letter]): GameState
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
    guesses: [Guess]
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
`;

const resolvers: IResolvers = {
  Query: {
    playGame: async (_, { guess }, { dataSources }) => {
      return dataSources.wordleDataSource.playGame(guess);
    },
  },
};

async function listen(port: number) {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
      return {
        wordleDataSource: new WordleDataSource(),
        dictionaryDataSource: new DictionaryDataSource(),
      };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  server.applyMiddleware({ app });

  return new Promise((resolve, reject) => {
    httpServer.listen(port).once('listening', resolve).once('error', reject);
  });
}

async function main() {
  try {
    await listen(4000);
    console.log('🚀 Server is ready at http://localhost:4000/graphql');
  } catch (err) {
    console.error('💀 Error starting the node server', err);
  }
}

main();
