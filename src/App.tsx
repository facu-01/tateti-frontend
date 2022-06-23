import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from 'pages/Login';
import axios from 'axios';
import { environment } from 'environment/environment';
import 'react-toastify/dist/ReactToastify.css';
import { Home } from 'pages/home/Home';
import { AuthGuard } from 'components/AuthGuard';
import { useAuthUser } from 'services/user';
import './App.css';
import { Register } from 'pages/Register';
import { Game } from 'pages/home/subPages/Game';
import { GameLauncher } from 'pages/home/subPages/GameLauncher';
import { ButtonGlitch } from 'components/ButtonGlitch';
import { GlitchWriter } from 'components/GlitchWriter';
import React from 'react';

axios.defaults.baseURL = environment.backendUrl;

//TODO: animate routes

export const App: React.FC = () => {
  const auth = useAuthUser();
  const navigate = useNavigate();

  return (
    <div
      className={'terminal'}
      style={{
        height: '100vh',
        width: '100%',
      }}
    >
      <Routes>
        <Route
          path={'/'}
          element={auth ? <Navigate to={'/home'} /> : <Login />}
        />
        <Route
          path={'/register'}
          element={auth ? <Navigate to={'/home'} /> : <Register />}
        />
        <Route
          path={'/home/'}
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        >
          <Route path={''} element={<GameLauncher />} />
          <Route path={'game/:gameToken'} element={<Game />} />
          <Route path={'game'} element={<Navigate to={'/home/'} />} />
          <Route
            path="*"
            element={
              <div
                style={{
                  display: 'grid',
                  height: '100%',
                  width: '100%',
                  placeItems: 'center',
                }}
              >
                <GlitchWriter
                  className={'terminal-alert terminal-alert-error'}
                  text={'There is nothing here!'}
                />
                <ButtonGlitch onClick={(): void => navigate('/home/')}>
                  Go back
                </ButtonGlitch>
              </div>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};
