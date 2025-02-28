import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { LoadingDots } from '@/components/ui/loading';

interface AssistantMessageProps {
  conversationId: string;
}

export function AssistantMessage({ conversationId }: AssistantMessageProps) {
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    console.log('conversationId', conversationId);

    // HACK: ConversationId will be empty when the message is first created
    if (!conversationId) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/conversation/${conversationId}/stream`
    );

    eventSource.onmessage = (event) => {
      const { data } = event;
      setResponseText((prev) => prev + data);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    eventSource.addEventListener('end', () => {
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, [conversationId]);

  return (
    <div>
      {!responseText ? (
        <LoadingDots />
      ) : (
        <ReactMarkdown>{responseText}</ReactMarkdown>
      )}
    </div>
  );
}
