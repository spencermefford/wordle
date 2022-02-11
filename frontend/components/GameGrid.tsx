/* eslint-disable react/no-array-index-key */
import classNames from 'classnames';
import { EMPTY_GUESS, MAX_TURNS } from '../lib/const';

function Cell({ letter, status }) {
  return (
    <div
      className={classNames(
        'aspect-square inline-flex border-2 border-neutral-600 text-neutral-200 justify-center items-center text-4xl font-bold',
        {
          'border-neutral-400': !!letter && !status,
          'bg-green-600 border-green-600': status === 'CORRECT',
          'bg-yellow-500 border-yellow-500': status === 'ALMOST',
          'bg-neutral-600': status === 'INCORRECT',
        }
      )}
    >
      {letter}
    </div>
  );
}

export default function GameGrid({ session, currentGuess, className }) {
  const { turns } = session;
  const emptyRows = turns.length < MAX_TURNS ? new Array(MAX_TURNS - turns.length - 1).fill('') : [];

  return (
    <div className={classNames('flex justify-center', className)}>
      <div className="grid gap-2 grid-cols-5 grid-rows-6 mt-20 mb-20 w-[40vw]">
        {turns.map(({ guesses }) => {
          return guesses.map(({ letter, status }, i) => <Cell letter={letter} status={status} key={i + letter} />);
        })}
        {turns.length < MAX_TURNS && currentGuess.map((letter, i) => <Cell letter={letter} key={i + letter} />)}
        {emptyRows.map((_, i) => {
          return EMPTY_GUESS.map(() => <Cell key={i} />);
        })}
      </div>
    </div>
  );
}
