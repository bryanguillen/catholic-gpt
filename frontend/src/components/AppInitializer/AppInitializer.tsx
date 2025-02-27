import { useActionState, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { PageLoader } from '@/components/PageLoader';

interface OwnProps {
  children: React.ReactNode;
}

function AppInitializer({ children }: OwnProps) {
  const [userId, setUserId] = useLocalStorageState('userId', {
    defaultValue: '',
  });
  // HACK: Assume happy path for beta version
  // TODO: Remove this once we have a proper auth flow
  const [, getUserIdFromServer, isPending] = useActionState(async () => {
    setUserId(await getUserId());
  }, null);

  useEffect(() => {
    if (!userId) {
      getUserIdFromServer();
    }
  }, [userId, setUserId, getUserIdFromServer]);

  if (!userId || isPending) {
    return <PageLoader data-testid="app-initializer-loader" />;
  }

  return children;
}

// HACK: Assume happy path for beta version
const getUserId = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/app-user`, {
    method: 'POST',
  });
  const data = await response.json();
  return data.id;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AppInitializer };
