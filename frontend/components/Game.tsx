import { gql, useMutation, useQuery } from '@apollo/client';
import { setCookies } from 'cookies-next';
import { useState } from 'react';
import { EMPTY_GUESS } from '../lib/const';
import GameGrid from './GameGrid';
import GameKeyboard from './GameKeyboard';
import { GameSession, Letter } from '../../backend/src/lib/types';

const GAME_SESSION_FIELDS = gql`
  fragment GameSessionFields on GameSession {
    id
    turns {
      guesses {
        letter
        status
      }
    }
    status
    result
    word
  }
`;

const GET_GAME_SESSION = gql`
  ${GAME_SESSION_FIELDS}
  query GetGameSession {
    gameSession {
      ...GameSessionFields
    }
  }
`;

const PLAY_GAME = gql`
  ${GAME_SESSION_FIELDS}
  mutation PlayGame($guess: [Letter]!) {
    playGame(guess: $guess) {
      ...GameSessionFields
    }
  }
`;

interface GameSessionResponse {
  gameSession: GameSession;
}

interface PlayGameResponse {
  playGame: GameSession;
}

export default function Game() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentGuess, setCurrentGuess] = useState<(Letter | null)[]>(EMPTY_GUESS);
  const {
    loading: sessionLoading,
    error: sessionError,
    data: sessionData,
  } = useQuery<GameSessionResponse>(GET_GAME_SESSION);
  const [playGame, { loading: playLoading, error: playError }] = useMutation<PlayGameResponse>(PLAY_GAME);

  const session = sessionData?.gameSession;
  if (session?.id) {
    setCookies('sesh', session.id);
  }

  const handleClick = async (value) => {
    if (session?.status === 'ACTIVE') {
      switch (value) {
        case 'ENTER':
          playGame({ variables: { guess: currentGuess } });
          setCurrentIndex(0);
          setCurrentGuess(EMPTY_GUESS);
          break;
        case '⌫':
          if (currentIndex > 0) {
            const newGuess = [...currentGuess];
            newGuess[currentIndex - 1] = null;
            setCurrentIndex(currentIndex - 1);
            setCurrentGuess(newGuess);
          }
          break;

        default: {
          if (currentIndex <= 4) {
            const newGuess = [...currentGuess];
            newGuess[currentIndex] = value;
            setCurrentIndex(currentIndex + 1);
            setCurrentGuess(newGuess);
          }
          break;
        }
      }
    }
  };

  if (sessionLoading) return 'Loading...';
  if (sessionError) return `Error! ${sessionError.message}`;

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-center text-neutral-200 text-4xl font-bold">WORDLE UNLIMITED</h1>
      <GameGrid className="grow" currentGuess={currentGuess} session={session} />
      <GameKeyboard session={session} onClick={handleClick} />
    </div>
  );
}
