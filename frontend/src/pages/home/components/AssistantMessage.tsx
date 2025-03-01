import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { LoadingDots } from '@/components/ui/loading';

interface AssistantMessageProps {
  conversationId: string;
}

export function AssistantMessage({ conversationId }: AssistantMessageProps) {
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

  return !responseText ? (
    <LoadingDots />
  ) : (
    <ReactMarkdown>{responseText}</ReactMarkdown>
  );
}
