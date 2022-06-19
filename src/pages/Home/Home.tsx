import { cleanSessionUser } from 'store/user';
import GlitchedWriter, { wait, WriterDataResponse } from 'glitched-writer';
import { useEffect, useRef } from 'react';
import { TextScramble } from '@a7sc11u/scramble';

export const Home: React.FC = () => {
  // create game

  // join game

  // browse games

  //TODO: close session

  //TEST

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const loadWriter = async () => {
      const Writer = new GlitchedWriter('#glitch_this', { letterize: true });
      await wait(1000);
      await Writer.write('my old friend.');

      await wait(1200);
      await Writer.write('This is only the beginning.');

      await wait(1500);
      await Writer.write('Please, say something...');
    };
    loadWriter();
  }, []);

  const elRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '70% 30%',
        gridTemplateColumns: '50% 50%',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div id="glitch_this">Welcome</div>
        <button
          data-glitch={'Create game'}
          className={'btn btn-default btn-ghost '}
        >
          Create game
        </button>
        <button
          data-glitch={'Create game'}
          className={'btn btn-default btn-ghost '}
          onClick={(): void => cleanSessionUser()}
        >
          close
        </button>
      </div>
    </div>
  );
};
