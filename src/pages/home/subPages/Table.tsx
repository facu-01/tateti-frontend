import { useQuery } from 'react-query';
import axios from 'axios';
import React, { useEffect, useMemo, useRef } from 'react';
import { ButtonGlitch } from 'components/ButtonGlitch';
import { useNavigate, useParams } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useGames = () =>
  useQuery(
    ['games'],
    ({ signal }) =>
      axios({
        signal,
        method: 'get',
        url: 'games',
      }),
    {
      refetchInterval: 1000,
    }
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
  const { data: dataGames, isLoading } = useGames();

  const rows = useMemo((): row[] => {
    if (!dataGames?.data) return [];
    return dataGames.data;
  }, [dataGames?.data]);

  const handleSwitchGame = (token: string): void =>
    navigate(`/home/game/${token}`);

  const currentGame = useRef(null);

  return (
    <div
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
              your turn
            </th>
            <th
              style={{
                border: '1px solid #222225',
              }}
            >
              status
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
              <ButtonGlitch
                style={{
                  width: '80%',
                  height: '60%',
                }}
                onClick={(): void => navigate('/home/')}
              >
                Go to home
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
                <tr key={index}>
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
                    <span
                      onClick={(): void => handleSwitchGame(token)}
                      className={'spanLink'}
                    >
                      {status}
                    </span>
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
