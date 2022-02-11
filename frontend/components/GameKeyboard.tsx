import classNames from 'classnames';
import { GameSession, Letter, GuessStatus } from '../../backend/src/lib/types';

const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

interface KeyProps {
  session: GameSession;
  value: string;
  onClick: (key: string) => void;
}

function Key({ session, value: key, onClick }: KeyProps) {
  return (
    <button
      type="button"
      disabled={session.status === 'COMPLETE'}
      className={classNames('hover:bg-neutral-300 bg-neutral-400 min-w-1 p-4 m-1 rounded-md cursor-pointer', {
        'font-4xl': key === '⌫',
      })}
      onClick={() => onClick(key)}
    >
      {key}
    </button>
  );
}

interface GameKeyboardProps {
  session: GameSession;
  onClick: (key: string) => void;
}

export default function GameKeyboard({ session, onClick }: GameKeyboardProps) {
  return (
    <>
      {keys.map((keyRow, i) => {
        return (
          <div className="flex justify-center" key={i}>
            {keyRow.map((key) => (
              <Key session={session} value={key} key={key} onClick={onClick} />
            ))}
          </div>
        );
      })}
    </>
  );
}
