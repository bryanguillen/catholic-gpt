import { useEffect, RefObject } from 'react';
import ReactMarkdown from 'react-markdown';
import { LoadingDots } from '@/components';
import { SenderType } from '@/types';
import { MessageContainer } from '../MessageContainer';
import { useAssistantResponseStream } from './useAssistantResponseStream';

interface AssistantMessageProps {
  conversationId: string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

function AssistantMessage({
  conversationId,
  messagesEndRef,
}: AssistantMessageProps) {
  const responseText = useAssistantResponseStream(conversationId);

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
