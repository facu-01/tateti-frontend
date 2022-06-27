import { useAuthUser } from 'services/user';
import { Navigate } from 'react-router-dom';
import { GlitchWriter } from 'components/GlitchWriter';
import React from 'react';

interface IAuthGuard {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<IAuthGuard> = ({ children }) => {
  const { auth, pending } = useAuthUser();

  if (pending) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <GlitchWriter text={'Loading...'} />
      </div>
    );
  }

  return auth ? <> {children} </> : <Navigate to={'/'} />;
};
