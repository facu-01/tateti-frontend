import { useMutation, useQuery } from 'react-query';
import axios, { Axios, AxiosError } from 'axios';
import { GlitchWriter } from 'components/GlitchWriter';
import React, { useState } from 'react';
import { ButtonGlitch } from 'components/ButtonGlitch';
import { ReactComponent as Circle } from 'components/images/O.svg';
import { ReactComponent as Cross } from 'components/images/X.svg';
import { GlitchSvg } from 'components/glitchSvg/GlitchSvg';
import { useNavigate, useParams } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useGame = (token: string | undefined) =>
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
      enabled: Boolean(token),
      retry: false,
      refetchInterval: (response, query) => {
        if (axios.isAxiosError(query.state.error)) {
          // Game token error
          if (
            query.state.error.response?.status === 400 ||
            query.state.error.response?.status === 403
          )
            return false;
        }
        if (query.state.errorUpdateCount >= 3) return false;
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

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <GlitchWriter
        className={'terminal-alert terminal-alert-error'}
        text={message}
      />
      <ButtonGlitch onClick={(): void => navigate('/home/')}>
        Go back
      </ButtonGlitch>
    </div>
  );
};

const LineInfo: React.FC<{
  message: string;
  data: string;
  isLoading: boolean;
  onEnd?: () => void;
}> = ({ data, message, isLoading, onEnd }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}
  >
    <GlitchWriter
      className={'terminal-prompt'}
      text={isLoading ? 'Loading...' : message}
      onEnd={onEnd}
    />
    <b>
      <GlitchWriter
        text={isLoading ? 'xxxxxxxxxxx' : data}
        endLess={isLoading}
      />
    </b>
  </div>
);

export const Game: React.FC = () => {
  const { gameToken } = useParams();
  const navigate = useNavigate();

  //fetch game
  const {
    data: dataGame,
    error: errorGame,
    isLoading: isLoadingGame,
    isError: isErrorGame,
    refetch: refetchGame,
    isSuccess: isSuccessGame,
  } = useGame(gameToken);

  const [showTable, setShowTable] = useState(false);

  //make move
  const { mutate: mutateMakeMove, isLoading: isLoadingMakeMove } =
    useMakeMove(refetchGame);

  const makeMove = (cellIndex: number): void => {
    if (gameToken) mutateMakeMove({ cellIndex, gameToken });
  };

  // TODO: tooltip for game token

  if (isErrorGame) {
    const getMessage = (): string => {
      if (axios.isAxiosError(errorGame)) {
        if (errorGame.response?.data) {
          const { errors } = errorGame.response.data as { errors: string };
          return errors;
        }
      }
      return 'Something went wrong :(';
    };
    return <ErrorMessage message={getMessage()} />;
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto',
        paddingLeft: '10px',
      }}
    >
      {gameToken && (
        <LineInfo
          message={'game token:'}
          data={gameToken}
          isLoading={isLoadingGame}
        />
      )}
      <LineInfo
        message={'game status:'}
        data={dataGame?.data.status}
        isLoading={isLoadingGame}
        onEnd={(): void => setShowTable(true)}
      />
      {!dataGame?.data.finished &&
        dataGame?.data.status !== 'waiting_for_join' && (
          <LineInfo
            message={'your turn:'}
            data={`${dataGame?.data?.yourTurn}`}
            isLoading={isLoadingGame}
          />
        )}

      {dataGame?.data.winner && (
        <LineInfo
          message={'winner:'}
          data={dataGame?.data.winner}
          isLoading={isLoadingGame}
        />
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
                  style={{
                    cursor: dataGame?.data.yourTurn ? 'pointer' : 'not-allowed',
                    backgroundColor: 'rgb(96 96 98)',
                    border: '1px solid grey',
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {symbol === 'x' && (
                    <GlitchSvg dimensions={[48, 48]} Svg={Cross} />
                  )}
                  {symbol === 'o' && (
                    <GlitchSvg dimensions={[48, 48]} Svg={Circle} />
                  )}
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
      <ButtonGlitch onClick={(): void => navigate('/home/')}>
        Go to home
      </ButtonGlitch>
    </div>
  );
};
