import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import { ContainerGlitch } from 'components/ContainerGlitch';
import { ButtonGlitch } from 'components/ButtonGlitch';
import { CustomInput } from 'components/CustomInput';
import { GlitchWriter } from 'components/GlitchWriter';
import { useNavigate } from 'react-router-dom';

//create game
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useCreateGame = () => {
  const navigate = useNavigate();
  return useMutation(
    () =>
      axios({
        method: 'post',
        url: 'games',
      }),
    {
      onSuccess: (response: AxiosResponse<{ gameToken: string }>) =>
        navigate(`/home/game/${response.data.gameToken}`),
    }
  );
};

//join game
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useJoinGame = () => {
  const navigate = useNavigate();
  return useMutation(
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
      onSuccess: (_, variables) => navigate(`/home/game/${variables}`),
    }
  );
};

const ErrorMessage: React.FC = () => (
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
      text={'Error creating a game :('}
    />
    <ButtonGlitch onClick={(): void => window.location.reload()}>
      Retry
    </ButtonGlitch>
  </div>
);

export const GameLauncher: React.FC = () => {
  // create game
  const {
    error: errorCreateGame,
    isLoading: isLoadingCreateGame,
    mutate: createGame,
  } = useCreateGame();

  // join game
  const { isLoading: isLoadingJoinGame, mutate: joinGame } = useJoinGame();

  const [joinGameToken, setJoinGameToken] = useState('');

  const handleJoinGame = (): void => {
    if (!joinGameToken) {
      toast.error('Please enter a game token');
      return;
    }
    joinGame(joinGameToken);
  };

  if (errorCreateGame) {
    return <ErrorMessage />;
  }

  if (isLoadingJoinGame || isLoadingCreateGame) {
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
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto',
        paddingLeft: '10px',
      }}
    >
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <ButtonGlitch onClick={(): void => createGame()}>
          Create Game
        </ButtonGlitch>
        <CustomInput
          label={'game token'}
          value={joinGameToken}
          onChange={(e): void => setJoinGameToken(e.target.value)}
        />
        <ButtonGlitch onClick={handleJoinGame}>Join Game</ButtonGlitch>
      </div>
    </div>
  );
};
