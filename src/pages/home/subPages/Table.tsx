import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import React, { useMemo, useRef, useState } from 'react';
import { ButtonGlitch } from 'components/ButtonGlitch';
import { useNavigate, useParams } from 'react-router-dom';
import { GlitchWriter } from 'components/GlitchWriter';
import { toast } from 'react-toastify';
import { ContainerGlitch } from 'components/ContainerGlitch';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useGames = (params: { myTurn: boolean; onlyPending: boolean }) =>
  useQuery(
    ['games', params],
    ({ signal }) =>
      axios({
        signal,
        method: 'get',
        url: 'games',
        params,
      }),
    {
      refetchInterval: 1000,
    }
  );

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useCancelGame = () =>
  useMutation((gameToken: string) =>
    toast.promise(
      axios({
        method: 'delete',
        url: 'games',
        data: {
          gameToken,
        },
      }),
      {
        pending: {
          render: () => {
            const text = 'Canceling game...';
            return <ContainerGlitch dataText={text}>{text}</ContainerGlitch>;
          },
        },
        success: {
          render: () => {
            const text = 'Game canceled successfully';
            return <ContainerGlitch dataText={text}>{text}</ContainerGlitch>;
          },
        },
        error: {
          render: ({ data }) => {
            if (data.response.data.errors) {
              return (
                <ContainerGlitch dataText={data.response.data.errors}>
                  {data.response.data.errors}
                </ContainerGlitch>
              );
            }
            const text = 'Error cancelling game!';
            return <ContainerGlitch dataText={text}>{text}</ContainerGlitch>;
          },
        },
      }
    )
  );

interface row {
  status: string;
  token: string;
  versus: string;
  winner: string | null;
  yourTurn: boolean;
  youWin: boolean | null;
  ended: boolean;
}

export const Table: React.FC = () => {
  const { gameToken } = useParams();
  const navigate = useNavigate();

  const [params, setParams] = useState({
    myTurn: false,
    onlyPending: false,
  });

  const { mutateAsync: cancelGame, isLoading: isloadingCancelGame } =
    useCancelGame();
  const {
    data: dataGames,
    isLoading: isloadingGames,
    refetch: refetchGames,
  } = useGames(params);

  const rows = useMemo((): row[] => {
    if (!dataGames?.data) return [];
    return dataGames.data;
  }, [dataGames?.data]);

  const handleCancelGame = async (gameToken: string): Promise<void> => {
    if (isloadingCancelGame) return;
    await cancelGame(gameToken);
    refetchGames();
  };

  const handleSwitchGame = (token: string): void =>
    navigate(`/home/game/${token}`);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const selectedGameRef = useRef<HTMLTableRowElement>(null);

  const scrollToGame = (gameRow: HTMLTableRowElement | null): void => {
    if (tableContainerRef.current === null) return;
    if (gameRow === null) return;
    gameRow.scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'center',
    });
  };

  const handleCheckBox =
    (field: 'onlyPending' | 'myTurn') =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setParams((prev) => ({ ...prev, [field]: event.target.checked }));

  if (isloadingGames) {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <GlitchWriter className={'terminal-prompt'} text={'Loading...'} />
      </div>
    );
  }

  return (
    <div
      ref={tableContainerRef}
      className={'hideScrollbar'}
      style={{
        height: '100%',
        width: '100%',
        overflow: 'auto',
        paddingLeft: '10px',
        paddingRight: '10px',
      }}
    >
      <table
        style={{
          borderCollapse: 'separate',
          borderColor: 'grey',
        }}
      >
        <caption>Game list</caption>
        <thead
          style={{
            position: 'sticky',
            insetBlockStart: 0,
            backgroundColor: '#222225',
          }}
        >
          <tr>
            <th
              style={{
                border: '1px solid #222225',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  height: '100%',
                  width: '100%',
                  gridTemplateColumns: '2fr 2px 1fr',
                  columnGap: '5px',
                }}
              >
                <span>your turn</span>
                <div
                  style={{
                    backgroundColor: 'grey',
                    height: '100%',
                    width: '2px',
                  }}
                />
                <div
                  style={{
                    display: 'grid',
                    alignItems: 'center',
                  }}
                >
                  <input
                    checked={params.myTurn}
                    onChange={handleCheckBox('myTurn')}
                    style={{
                      gridRow: '1',
                    }}
                    type={'checkbox'}
                  />
                </div>
              </div>
            </th>
            <th
              style={{
                border: '1px solid #222225',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  height: '100%',
                  width: '100%',
                  gridTemplateColumns: 'auto 2px auto',
                }}
              >
                <span>status</span>
                <div
                  style={{
                    backgroundColor: 'grey',
                    height: '100%',
                    width: '2px',
                  }}
                />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: 'auto',
                    alignItems: 'center',
                  }}
                >
                  <small
                    style={{
                      gridRow: '1',
                    }}
                  >
                    only pending
                  </small>
                  <input
                    checked={params.onlyPending}
                    onChange={handleCheckBox('onlyPending')}
                    style={{
                      gridRow: '1',
                    }}
                    type={'checkbox'}
                  />
                </div>
              </div>
            </th>
            <th
              style={{
                border: '1px solid #222225',
              }}
            >
              versus
            </th>
            <th
              style={{
                border: '1px solid #222225',
              }}
            >
              winner
            </th>
          </tr>
        </thead>
        <tfoot
          style={{
            position: 'sticky',
            insetBlockEnd: 0,
            backgroundColor: '#222225',
          }}
        >
          <tr>
            <th
              style={{
                border: '1px solid #222225',
              }}
              colSpan={4}
            >
              <ButtonGlitch onClick={(): void => navigate('/home/')}>
                Go to home
              </ButtonGlitch>
              <ButtonGlitch
                onClick={(): void => scrollToGame(selectedGameRef.current)}
              >
                Current game
              </ButtonGlitch>
            </th>
          </tr>
        </tfoot>
        <tbody
          style={{
            paddingTop: '100px',
            overflow: 'auto',
          }}
        >
          {rows.map(
            (
              { yourTurn, versus, winner, status, ended, youWin, token },
              index
            ) => {
              const selectedGameStyle =
                gameToken === token
                  ? {
                      borderTop: '1px solid var(--primary-color)',
                      borderBottom: '1px solid var(--primary-color)',
                    }
                  : {
                      borderTop: '1px solid #222225',
                      borderBottom: '1px solid #222225',
                    };

              return (
                <tr
                  ref={gameToken === token ? selectedGameRef : undefined}
                  key={index}
                >
                  <th
                    style={{
                      border: '1px solid #222225',
                      borderLeft:
                        gameToken === token
                          ? '1px solid var(--primary-color)'
                          : '1px solid #222225',
                      ...selectedGameStyle,
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: yourTurn && !ended ? 'green' : 'unset',
                      }}
                    >
                      {!ended ? (yourTurn ? '✔' : '❌') : '-'}
                    </span>
                  </th>
                  <td
                    style={{
                      border: '1px solid #222225',
                      ...selectedGameStyle,
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        height: '100%',
                        width: '100%',
                        gridTemplateColumns: '1fr 2px 1fr',
                        columnGap: '5px',
                      }}
                    >
                      <div>
                        <span
                          onClick={(): void => handleSwitchGame(token)}
                          className={'spanLink'}
                        >
                          {status}
                        </span>
                      </div>
                      {status === 'waiting_for_join' && (
                        <div
                          style={{
                            backgroundColor: 'grey',
                            height: '100%',
                            width: '2px',
                          }}
                        />
                      )}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                        }}
                      >
                        {status === 'waiting_for_join' && (
                          <span
                            onClick={(): Promise<void> =>
                              handleCancelGame(token)
                            }
                            style={{
                              color: 'red',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                          >
                            cancel
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      border: '1px solid #222225',
                      ...selectedGameStyle,
                    }}
                  >
                    {versus}
                  </td>
                  <td
                    style={{
                      border: '1px solid #222225',
                      borderRight:
                        gameToken === token
                          ? '1px solid var(--primary-color)'
                          : '1px solid #222225',
                      ...selectedGameStyle,
                    }}
                  >
                    <span
                      style={{
                        color: !winner ? 'unset' : youWin ? 'green' : 'red',
                      }}
                    >
                      {winner ? winner : '-'}
                    </span>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};
