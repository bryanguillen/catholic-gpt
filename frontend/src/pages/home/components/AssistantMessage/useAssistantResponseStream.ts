import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';

import { useAssistantStreamingContext } from '../../context/AssistantStreamingContext';

const useAssistantResponseStream = (conversationId: string) => {
  const [responseText, setResponseText] = useState('');
  const isInitialized = useRef(false);
  const { setIsStreaming } = useAssistantStreamingContext();

  useEffect(() => {
    // HACK: ConversationId will be empty when the message is first created
    if (!conversationId || isInitialized.current) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/conversation/${conversationId}/stream`
    );

    isInitialized.current = true;

    eventSource.onopen = () => {
      setIsStreaming(true);
    };

    eventSource.onmessage = (event) => {
      const { data } = event;

      if (data.includes('[DONE]')) {
        setIsStreaming(false);
        eventSource.close();
        return;
      }

      setResponseText((prev) => {
        return prev + data;
      });
    };

    eventSource.onerror = () => {
      toast.error('Error while streaming', {
        description: 'Closed stream due to error. Try again.',
      });
      setIsStreaming(false);
      eventSource.close();
    };
  }, [conversationId, setResponseText, setIsStreaming]);

  return responseText;
};

export { useAssistantResponseStream };
