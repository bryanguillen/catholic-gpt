import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';

const useAssistantResponseStream = (conversationId: string) => {
  const [responseText, setResponseText] = useState('');
  const isInitialized = useRef(false);

  useEffect(() => {
    // HACK: ConversationId will be empty when the message is first created
    if (!conversationId || isInitialized.current) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/conversation/${conversationId}/stream`
    );

    isInitialized.current = true;

    eventSource.onmessage = (event) => {
      const { data } = event;

      if (data.includes('[DONE]')) {
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
      eventSource.close();
    };
  }, [conversationId, setResponseText]);

  return responseText;
};

export { useAssistantResponseStream };
