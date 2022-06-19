import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from 'pages/Login';
import axios from 'axios';
import { environment } from 'environment/environment';
import 'react-toastify/dist/ReactToastify.css';
import { Home } from 'pages/Home/Home';
import { AuthGuard } from 'components/AuthGuard';
import { useAuthUser } from 'services/user';
import './App.css';
import { Register } from 'pages/Register';

axios.defaults.baseURL = environment.backendUrl;

//TODO: animate routes

export const App: React.FC = () => {
  const auth = useAuthUser();

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
          path={'/home'}
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
      </Routes>
    </div>
  );
};
