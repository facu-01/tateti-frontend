import { Subject } from 'rxjs';
import { useLayoutEffect, useState } from 'react';
import axios from 'axios';

export interface User {
  name: string;
}

let currentUser: User | undefined;

// RXJS
const userSubject = new Subject<User | undefined>();

export const useSessionUser = (): User | undefined => {
  const [user, setUser] = useState(currentUser);

  useLayoutEffect(() => {
    userSubject.subscribe((newState) => setUser(newState));
  }, []);

  return user;
};

export const updateSessionUser = async (token: string): Promise<void> => {
  //Fetch user
  try {
    const { data } = await axios({
      method: 'get',
      url: 'players/show',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('from Login', { data });
    userSubject.next(data);
    saveToken(token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } catch (error) {
    cleanSessionUser();
  }
};

export const cleanSessionUser = (): void => {
  currentUser = undefined;
  userSubject.next(currentUser);
  clearToken();
  axios.defaults.headers.common.Authorization = '';
};

// handle session storage
const saveToken = (token: string): void =>
  sessionStorage.setItem('token', token);

const getToken = (): null | string => sessionStorage.getItem('token');

const clearToken = (): void => sessionStorage.removeItem('token');
