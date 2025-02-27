import { useActionState, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

interface OwnProps {
  children: React.ReactNode;
}

export const AppInitializer = ({ children }: OwnProps) => {
  const [userId, setUserId] = useLocalStorageState('userId', {
    defaultValue: '',
  });
  const [_, getUserIdFromServer, isPending] = useActionState(async () => {
    setUserId(await getUserId());
  }, null);

  useEffect(() => {
    if (!userId) {
      getUserIdFromServer();
    }
  }, [userId, setUserId, getUserIdFromServer]);

  if (!userId || isPending) {
    return <div>Loading...</div>;
  }

  return children;
};

const getUserId = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/app-user`, {
    method: 'POST',
  });
  const data = await response.json();
  return data.id;
};
