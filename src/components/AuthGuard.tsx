import { useAuthUser } from 'services/user';
import { Navigate } from 'react-router-dom';

interface IAuthGuard {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<IAuthGuard> = ({ children }) => {
  const auth = useAuthUser();

  return auth ? <> {children} </> : <Navigate to={'/'} />;
};
