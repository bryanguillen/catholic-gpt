import { useRef, useState, useEffect } from 'react';

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
      eventSource.close();
    };
  }, [conversationId, setResponseText]);

  return responseText;
};

export { useAssistantResponseStream };
