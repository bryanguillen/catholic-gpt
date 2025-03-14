import ReactMarkdown from 'react-markdown';
import { LoadingDots } from '@/components';
import { SenderType } from '@/types';
import { MessageContainer } from '../MessageContainer';
import { useAssistantResponseStream } from './useAssistantResponseStream';

interface AssistantMessageProps {
  conversationId: string;
}

function AssistantMessage({ conversationId }: AssistantMessageProps) {
  const responseText = useAssistantResponseStream(conversationId);

  return (
    <MessageContainer senderType={SenderType.ASSISTANT}>
      {!responseText ? (
        <LoadingDots data-testid="assistant-message-loading-dots" />
      ) : (
        <ReactMarkdown>{responseText}</ReactMarkdown>
      )}
    </MessageContainer>
  );
}

export { AssistantMessage };
