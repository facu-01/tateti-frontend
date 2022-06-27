import { useSessionUser } from 'store/user';

export const useAuthUser = (): { pending: boolean; auth: boolean } => {
  const { pending, user } = useSessionUser();

  if (pending) return { pending: true, auth: false };

  return { pending: false, auth: user !== undefined };
};
