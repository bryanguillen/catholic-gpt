import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';

import { useAssistantStreamingContext } from '../../context/AssistantStreamingContext';

const useAssistantResponseStream = (conversationId: string) => {
  const [responseText, setResponseText] = useState('');
  const isInitialized = useRef(false);
  const [doneStreaming, setDoneStreaming] = useState(false);
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
        setDoneStreaming(true);
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
  }, [conversationId, setResponseText, setIsStreaming, setDoneStreaming]);

  return { responseText, doneStreaming };
};

export { useAssistantResponseStream };
