import { createContext } from 'react';

interface AssistantStreamingContextType {
  isStreaming: boolean;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
}

const AssistantStreamingContext = createContext<AssistantStreamingContextType>({
  isStreaming: false,
  setIsStreaming: () => {},
});

export { AssistantStreamingContext };
