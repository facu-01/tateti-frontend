import { cleanSessionUser } from 'store/user';
import GlitchedWriter, {
  presets,
  wait,
  WriterDataResponse,
} from 'glitched-writer';
import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'pages/Home/Bar';
import { ButtonGlitch } from 'components/ButtonGlitch';
import { useMutation } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import { GlitchWriter } from 'components/GlitchWriter';
import { Game } from 'pages/Home/Game';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useCreateGame = () =>
  useMutation(() =>
    axios({
      method: 'post',
      url: 'games',
    })
  );

export const Home: React.FC = () => {
  // create game
  const {
    data,
    error,
    isLoading,
    isSuccess,
    reset: resetCreateGame,
    mutate: createGame,
  } = useCreateGame();

  // join game

  // browse games

  // TODO: tooltip for game token

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '100px 70% 30%',
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
          // placeItems: 'center',
        }}
      >
        {!data && !isLoading && (
          <div>
            <ButtonGlitch onClick={(): void => createGame()}>
              Create Game
            </ButtonGlitch>
          </div>
        )}
        {(data || isLoading) && (
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
                text={isLoading ? 'Loading...' : 'game token:'}
              />
              {(data || isLoading) && (
                <b>
                  <GlitchWriter
                    text={isSuccess ? data.data.gameToken : 'xxxxxxxxxxx'}
                    endLess={!isSuccess}
                  />
                </b>
              )}
            </div>
          </>
        )}
        {isSuccess && <Game gameToken={data.data.gameToken} />}
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <ButtonGlitch onClick={resetCreateGame}>TestClose</ButtonGlitch>
        </div>
      </div>
    </div>
  );
};
