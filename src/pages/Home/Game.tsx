import { useMutation, useQuery } from 'react-query';
import axios, { Axios } from 'axios';
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
      refetchInterval: (response) => {
        if (response?.data?.finished) return false;
        if (response?.data?.yourTurn) return false;
        return 1000;
      },
    }
  );

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useMakeMove = (refetchGame: () => void) =>
  useMutation(
    ({ cellIndex, gameToken }: { cellIndex: number; gameToken: string }) =>
      axios({
        method: 'post',
        url: 'games/move',
        data: {
          cellIndex,
          gameToken,
        },
      }),
    {
      onSuccess: refetchGame,
    }
  );

export const Game: React.FC<{ gameToken: string }> = ({ gameToken }) => {
  //fetch game
  const {
    data: dataGame,
    isLoading: isLoadingGame,
    isError: isErrorGame,
    refetch: refetchGame,
    isSuccess: isSuccessGame,
  } = useGame(gameToken);

  const [showTable, setShowTable] = useState(false);

  //make move
  const { mutate: mutateMakeMove, isLoading: isLoadingMakeMove } =
    useMakeMove(refetchGame);

  const makeMove = (cellIndex: number): void =>
    mutateMakeMove({ cellIndex, gameToken });

  if (isErrorGame) {
    return (
      <div className={'terminal-alert terminal-alert-error'}>
        <GlitchWriter text={'Something went wrong :('} />
      </div>
    );
  }

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
          text={isLoadingGame ? 'Loading...' : 'game status:'}
          onEnd={(): void => setShowTable(true)}
        />
        {(dataGame || isLoadingGame) && (
          <b>
            <GlitchWriter
              text={isSuccessGame ? dataGame?.data.status : 'xxxxxxxxxxx'}
              endLess={!isSuccessGame}
            />
          </b>
        )}
      </div>
      {!dataGame?.data.finished && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <GlitchWriter
            className={'terminal-prompt'}
            text={isLoadingGame ? 'Loading...' : 'your turn:'}
          />
          {(dataGame || isLoadingGame) && (
            <b>
              <GlitchWriter
                text={
                  isSuccessGame
                    ? dataGame?.data?.yourTurn
                      ? 'true'
                      : 'false'
                    : 'xxxx'
                }
                endLess={!isSuccessGame}
              />
            </b>
          )}
        </div>
      )}
      {dataGame?.data.winner && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <GlitchWriter className={'terminal-prompt'} text={'winner:'} />
          <b>
            <GlitchWriter text={dataGame?.data.winner} />
          </b>
        </div>
      )}
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
          {showTable && dataGame?.data?.table
            ? dataGame?.data.table.map((symbol: string | null, i: number) => (
                <button
                  onClick={(): void => makeMove(i)}
                  disabled={!dataGame?.data.yourTurn}
                  key={i}
                  className={'btn btn-default'}
                  style={{
                    cursor: dataGame?.data.yourTurn ? 'pointer' : 'not-allowed',
                    border: '1px solid grey',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {symbol}
                </button>
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
