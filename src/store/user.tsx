import { Subject } from 'rxjs';
import { useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { environment } from 'environment/environment';

interface ISessionUser {
  user: { name: string } | undefined;
  pending: boolean;
}

let currentUser: ISessionUser = { user: undefined, pending: true };

// RXJS
const userSubject = new Subject<ISessionUser>();

export const useSessionUser = (): ISessionUser => {
  const [session, setSession] = useState(currentUser);

  useLayoutEffect(() => {
    userSubject.subscribe((newState) => setSession(newState));
  }, []);

  return session;
};

export const updateSessionUser = async (
  token: string | null
): Promise<void> => {
  if (!token) {
    currentUser = { user: undefined, pending: false };
    userSubject.next(currentUser);
    return;
  }
  //Fetch user
  try {
    const { data } = await axios({
      method: 'get',
      baseURL: environment.backendUrl,
      url: 'players/show',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    currentUser = { user: data, pending: false };
    userSubject.next(currentUser);
    saveToken(token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } catch (error) {
    cleanSessionUser();
  }
};

export const cleanSessionUser = (): void => {
  currentUser = { user: undefined, pending: false };
  userSubject.next(currentUser);
  clearToken();
  axios.defaults.headers.common.Authorization = '';
};

// handle session storage
const saveToken = (token: string): void =>
  sessionStorage.setItem('token', token);

const getToken = (): string | null => sessionStorage.getItem('token');

const clearToken = (): void => sessionStorage.removeItem('token');

const token = getToken();

updateSessionUser(token);
