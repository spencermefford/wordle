import classNames from 'classnames';

const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

function Key({ session, value: key, onClick }) {
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

export default function GameKeyboard({ session, onClick }) {
  return (
    <>
      {keys.map((keyRow) => {
        return (
          <div className="flex justify-center" key={keyRow}>
            {keyRow.map((key) => (
              <Key session={session} value={key} key={key} onClick={onClick} />
            ))}
          </div>
        );
      })}
    </>
  );
}
