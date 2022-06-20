import { useQuery } from 'react-query';
import axios from 'axios';
import { GlitchWriter } from 'components/GlitchWriter';
import React, { useState } from 'react';
import { ButtonGlitch } from 'components/ButtonGlitch';

interface IGame {
  gameToken: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useGame = (token: string) =>
  useQuery(
    ['game', token],
    ({ signal }) =>
      axios({
        signal,
        method: 'get',
        url: 'games/show',
        params: {
          gameToken: token,
        },
      }),
    {
      refetchInterval: 1000,
    }
  );

export const Game: React.FC<{ gameToken: string }> = ({ gameToken }) => {
  const { data, isLoading, isError, isSuccess } = useGame(gameToken);

  const [showTable, setShowTable] = useState(false);

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <GlitchWriter
          className={'terminal-prompt'}
          text={isLoading ? 'Loading...' : 'game status:'}
          onEnd={(): void => setShowTable(true)}
        />
        {(data || isLoading) && (
          <b>
            <GlitchWriter
              text={isSuccess ? data.data.status : 'xxxxxxxxxxx'}
              endLess={!isSuccess}
            />
          </b>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <GlitchWriter
          className={'terminal-prompt'}
          text={isLoading ? 'Loading...' : 'your turn:'}
          onEnd={(): void => setShowTable(true)}
        />
        {(data || isLoading) && (
          <b>
            <GlitchWriter
              text={
                isSuccess ? (data.data?.yourTurn ? 'true' : 'false') : 'xxxx'
              }
              endLess={!isSuccess}
            />
          </b>
        )}
      </div>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div
          className={showTable ? 'animate__animated animate__fadeIn' : ''}
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(3, 100px)',
            gridTemplateColumns: 'repeat(3, 100px)',
          }}
        >
          {showTable && data?.data?.table
            ? data.data.table.map((_: never, i: number) => (
                <button
                  disabled={!data.data.yourTurn}
                  key={i}
                  className={'btn btn-default'}
                  style={{
                    border: '1px solid grey',
                    width: '100%',
                    height: '100%',
                  }}
                ></button>
              ))
            : [...Array(9)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid grey',
                    width: '100%',
                    height: '100%',
                  }}
                ></div>
              ))}
        </div>
      </div>
    </>
  );
};
