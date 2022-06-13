import { Route, Routes } from 'react-router-dom';
import { Login } from 'pages/Login';

export const App: React.FC = () => {
  return (
    <div className={'terminal'}>
      <Routes>
        <Route path={'/'} element={<Login />} />
      </Routes>
    </div>
  );
};
