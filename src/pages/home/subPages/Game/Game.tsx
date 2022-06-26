import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { GlitchWriter } from 'components/GlitchWriter';
import React, { useEffect, useState } from 'react';
import { ButtonGlitch } from 'components/ButtonGlitch';
import { ReactComponent as Circle } from 'components/images/O.svg';
import { ReactComponent as Cross } from 'components/images/X.svg';
import { GlitchSvg } from 'components/glitchSvg/GlitchSvg';
import { useNavigate, useParams } from 'react-router-dom';
import './buttonCell.css';
import { toast } from 'react-toastify';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useGame = (token: string | undefined, showTable: () => void) =>
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
        if (response?.data?.ended) return false;
        if (response?.data?.yourTurn) return false;
        return 1000;
      },
      onSuccess: (response) => {
        showTable();
        if (response.data.status === 'tied') toast.success('Its a tie!');
        if (response.data.youWin) toast.success('You win!');
        if (response.data.youWin === false) toast.error('You lost!');
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

interface ILineInfo extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  data: string;
  isLoading: boolean;
  onEnd?: () => void;
}

const LineInfo: React.FC<ILineInfo> = ({
  data,
  message,
  isLoading,
  onEnd,
  ...rest
}) => (
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
        {...rest}
      />
    </b>
  </div>
);

export const Game: React.FC = () => {
  const { gameToken } = useParams();

  const [showTable, setShowTable] = useState(false);

  useEffect(() => setShowTable(false), [gameToken]);

  // TODO: tooltip for game token

  //fetch game
  const {
    data: dataGame,
    error: errorGame,
    isLoading: isLoadingGame,
    isError: isErrorGame,
    refetch: refetchGame,
  } = useGame(gameToken, () => setShowTable(true));

  //TODO loading move?
  //make move
  const {
    mutate: mutateMakeMove,
    // isLoading: isLoadingMakeMove
  } = useMakeMove(refetchGame);

  const makeMove = (cellIndex: number): void => {
    if (gameToken) mutateMakeMove({ cellIndex, gameToken });
  };

  const winningCell = (cellIndex: number): boolean => {
    if (!dataGame?.data?.winningCombination) return false;
    return dataGame.data.winningCombination.includes(cellIndex);
  };

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {gameToken && (
          <LineInfo
            message={'game token:'}
            data={gameToken}
            isLoading={isLoadingGame}
          />
        )}
        {!dataGame?.data.ended && dataGame?.data.status !== 'waiting_for_join' && (
          <LineInfo
            message={'your turn:'}
            data={
              !dataGame?.data?.ended
                ? dataGame?.data?.yourTurn
                  ? '✔'
                  : '❌'
                : '-'
            }
            isLoading={isLoadingGame}
            style={{
              color: dataGame?.data?.yourTurn ? 'green' : 'red',
            }}
          />
        )}
        {dataGame?.data.yourSymbol && (
          <LineInfo
            message={'your symbol:'}
            data={dataGame?.data?.yourSymbol.toUpperCase()}
            style={{
              color: 'var(--primary-color)',
            }}
            isLoading={isLoadingGame}
          />
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
          className={
            showTable ? 'animate__animated animate__fadeIn' : undefined
          }
          style={{
            display: 'grid',
            rowGap: '10px',
            columnGap: '10px',
            gridTemplateRows: 'repeat(3, 150px)',
            gridTemplateColumns: 'repeat(3, 150px)',
          }}
        >
          {showTable && dataGame?.data?.table
            ? dataGame?.data.table.map(
                (symbol: string | null, index: number) => (
                  <div
                    key={index}
                    className={
                      winningCell(index)
                        ? 'animate__flipInX animate__animated gradient-border'
                        : undefined
                    }
                  >
                    <div
                      onClick={(): void => {
                        if (
                          !dataGame.data.yourTurn ||
                          symbol !== null ||
                          dataGame.data.ended
                        ) {
                          return;
                        }
                        makeMove(index);
                      }}
                      className={
                        symbol
                          ? symbol === dataGame.data.yourSymbol
                            ? 'btn-pixel btn-pixel-current-player'
                            : 'btn-pixel btn-pixel-vs-player'
                          : undefined
                      }
                      style={{
                        cursor:
                          dataGame.data.yourTurn &&
                          symbol === null &&
                          !dataGame.data.ended
                            ? 'pointer'
                            : 'not-allowed',
                        backgroundColor: !symbol ? '#222225' : undefined,
                        border: !winningCell(index)
                          ? '1px solid grey'
                          : undefined,
                        width: '100%',
                        height: '100%',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {symbol === 'x' && (
                        <GlitchSvg dimensions={[70, 70]} Svg={Cross} />
                      )}
                      {symbol === 'o' && (
                        <GlitchSvg dimensions={[70, 70]} Svg={Circle} />
                      )}
                    </div>
                  </div>
                )
              )
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
    </div>
  );
};
