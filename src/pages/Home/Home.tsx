import { cleanSessionUser } from 'store/user';
import GlitchedWriter, {
  presets,
  wait,
  WriterDataResponse,
} from 'glitched-writer';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bar } from 'pages/Home/Bar';
import { ButtonGlitch } from 'components/ButtonGlitch';
import { useMutation } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import { GlitchWriter } from 'components/GlitchWriter';
import { Game } from 'pages/Home/Game';
import { toast } from 'react-toastify';
import { ContainerGlitch } from 'components/ContainerGlitch';
import { CustomInput } from 'components/CustomInput';

//create game
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useCreateGame = (
  setGameToken: React.Dispatch<React.SetStateAction<string>>
) =>
  useMutation(
    () =>
      axios({
        method: 'post',
        url: 'games',
      }),
    {
      onSuccess: (response: AxiosResponse<{ gameToken: string }>) =>
        setGameToken(response.data.gameToken),
    }
  );

//join game
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useJoinGame = (
  setGameToken: React.Dispatch<React.SetStateAction<string>>
) =>
  useMutation(
    (gameToken: string) =>
      toast.promise(
        axios({
          method: 'post',
          url: 'games/join',
          data: {
            gameToken,
          },
        }),
        {
          pending: {
            render: () => {
              const text = 'Joining game...';
              return <ContainerGlitch dataText={text}>{text}</ContainerGlitch>;
            },
          },
          success: {
            render: () => {
              const text = 'Joined game!';
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
              const text = 'Error joining game!';
              return <ContainerGlitch dataText={text}>{text}</ContainerGlitch>;
            },
          },
        }
      ),
    {
      onSuccess: (_, variables) => setGameToken(variables),
    }
  );

export const Home: React.FC = () => {
  // manage game
  const [gameToken, setGameToken] = useState('');

  const handleClearGame = (): void => {
    setGameToken('');
    resetCreateGame();
    resetJoinGame();
  };

  // create game
  const {
    data: createGameData,
    error: errorCreateGame,
    isLoading: isLoadingCreateGame,
    isSuccess: isSuccessCreateGame,
    reset: resetCreateGame,
    mutate: createGame,
  } = useCreateGame(setGameToken);

  // join game
  const {
    data: dataJoinGame,
    isLoading: isLoadingJoinGame,
    isSuccess: isSuccessJoinGame,
    error: errorJoinGame,
    mutate: joinGame,
    reset: resetJoinGame,
  } = useJoinGame(setGameToken);

  const [joinGameToken, setJoinGameToken] = useState('');

  const handleJoinGame = (): void => {
    if (!joinGameToken) {
      toast.error('Please enter a game token');
      return;
    }
    joinGame(joinGameToken);
  };

  // browse games

  // TODO: tooltip for game token

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '100px 70%',
        gridTemplateColumns: '50% 50%',
      }}
    >
      <div
        style={{
          gridColumn: '1 / -1',
        }}
      >
        <Bar />
      </div>
      <div
        style={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto',
          paddingLeft: '10px',
        }}
      >
        {!createGameData &&
          !isLoadingCreateGame &&
          !isLoadingJoinGame &&
          !dataJoinGame && (
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <ButtonGlitch
                disabled={isLoadingCreateGame || isLoadingJoinGame}
                onClick={(): void => createGame()}
              >
                Create Game
              </ButtonGlitch>
              <CustomInput
                disabled={isLoadingCreateGame || isLoadingJoinGame}
                label={'game token'}
                value={joinGameToken}
                onChange={(e): void => setJoinGameToken(e.target.value)}
              />
              <ButtonGlitch
                disabled={isLoadingCreateGame || isLoadingJoinGame}
                onClick={handleJoinGame}
              >
                Join Game
              </ButtonGlitch>
            </div>
          )}

        {(createGameData ||
          isLoadingCreateGame ||
          dataJoinGame ||
          isLoadingJoinGame) && (
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
                text={isLoadingCreateGame ? 'Loading...' : 'game token:'}
              />
              {(createGameData ||
                isLoadingCreateGame ||
                dataJoinGame ||
                isLoadingJoinGame) && (
                <b>
                  <GlitchWriter
                    text={
                      isSuccessCreateGame || isSuccessJoinGame
                        ? gameToken
                        : 'xxxxxxxxxxx'
                    }
                    endLess={!isSuccessCreateGame && !isSuccessJoinGame}
                  />
                </b>
              )}
            </div>
          </>
        )}
        {gameToken && <Game gameToken={gameToken} />}
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <ButtonGlitch onClick={handleClearGame}>TestClose</ButtonGlitch>
        </div>
      </div>
    </div>
  );
};
