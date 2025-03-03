import { useActionState, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { toast } from 'sonner';

import { LoadingSpinner } from '@/components';

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
    return <PageLoader />;
  }

  return children;
}

// HACK: Assume happy path for beta version
const getUserId = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/app-user`, {
      method: 'POST',
    });
    const data = await response.json();
    return data.id;
  } catch (error) {
    toast.error('Failed to create your user', {
      description: 'Please try again by refreshing',
    });
  }
};

function PageLoader() {
  return (
    <div
      data-testid="app-initializer-loader"
      className={'flex h-screen w-screen items-center justify-center'}
    >
      <LoadingSpinner />
    </div>
  );
}

export { AppInitializer };
