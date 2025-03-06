import { useContext } from 'react';
import { AssistantStreamingContext } from './AssistantStreamingContext';

function useAssistantStreamingContext() {
  const context = useContext(AssistantStreamingContext);
  if (!context) {
    throw new Error(
      'useAssistantStreamingContext must be used within a AssistantStreamingContextProvider'
    );
  }
  return context;
}

export { useAssistantStreamingContext };
