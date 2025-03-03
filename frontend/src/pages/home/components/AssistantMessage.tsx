import { useEffect, useState, useRef, RefObject } from 'react';
import ReactMarkdown from 'react-markdown';
import { LoadingDots } from '@/components';
import { SenderType } from '@/types';
import { MessageContainer } from './MessageContainer';

interface AssistantMessageProps {
  conversationId: string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

function AssistantMessage({
  conversationId,
  messagesEndRef,
}: AssistantMessageProps) {
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseText]);

  return (
    <MessageContainer senderType={SenderType.ASSISTANT}>
      {!responseText ? (
        <LoadingDots />
      ) : (
        <ReactMarkdown>{responseText}</ReactMarkdown>
      )}
    </MessageContainer>
  );
}

export { AssistantMessage };
