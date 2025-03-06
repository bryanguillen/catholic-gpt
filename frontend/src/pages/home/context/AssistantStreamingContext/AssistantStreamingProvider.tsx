import { useState, useMemo } from 'react';

import { AssistantStreamingContext } from './AssistantStreamingContext';

function AssistantStreamingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isStreaming, setIsStreaming] = useState(false);

  const value = useMemo(
    () => ({ isStreaming, setIsStreaming }),
    [isStreaming, setIsStreaming]
  );

  return (
    <AssistantStreamingContext.Provider value={value}>
      {children}
    </AssistantStreamingContext.Provider>
  );
}

export { AssistantStreamingProvider };
