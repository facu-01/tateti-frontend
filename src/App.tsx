import { Route, Routes } from 'react-router-dom';
import { Login } from 'pages/Login';
import axios from 'axios';
import { environment } from 'environment/environment';
import { Register } from 'pages/Register';

axios.defaults.baseURL = environment.backendUrl;

export const App: React.FC = () => {
  return (
    <div
      className={'terminal'}
      style={{
        height: '100vh',
        width: '100%',
      }}
    >
      <Routes>
        <Route path={'/'} element={<Login />} />
        <Route path={'/register'} element={<Register />} />
      </Routes>
    </div>
  );
};
