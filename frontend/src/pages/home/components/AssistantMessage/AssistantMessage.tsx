import ReactMarkdown from 'react-markdown';
import { LoadingDots, Button } from '@/components';
import { SenderType } from '@/types';
import { Copy } from 'lucide-react';

import { MessageContainer } from '../MessageContainer';
import { useAssistantResponseStream } from './useAssistantResponseStream';

interface AssistantMessageProps {
  conversationId: string;
}

function AssistantMessage({ conversationId }: AssistantMessageProps) {
  const { responseText, doneStreaming } =
    useAssistantResponseStream(conversationId);

  const handleCopy = () => {
    if (!responseText) return;
    navigator.clipboard.writeText(responseText);
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <MessageContainer senderType={SenderType.ASSISTANT}>
        {!responseText ? (
          <LoadingDots data-testid="assistant-message-loading-dots" />
        ) : (
          <ReactMarkdown>{responseText}</ReactMarkdown>
        )}
      </MessageContainer>

      {responseText && doneStreaming && (
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          data-testid="assistant-message-copy-button"
        >
          <Copy />
        </Button>
      )}
    </div>
  );
}

export { AssistantMessage };
