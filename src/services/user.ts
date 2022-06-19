import { useSessionUser } from 'store/user';

export const useAuthUser = (): boolean => {
  const { pending, user } = useSessionUser();

  if (pending) return true;

  return user !== undefined;
};
