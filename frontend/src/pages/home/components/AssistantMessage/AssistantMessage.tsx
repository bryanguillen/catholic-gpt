import ReactMarkdown from 'react-markdown';
import { LoadingDots, Button } from '@/components';
import { SenderType } from '@/types';
import { MessageContainer } from '../MessageContainer';
import { useAssistantResponseStream } from './useAssistantResponseStream';
import { useAssistantStreamingContext } from '../../context/AssistantStreamingContext';
import { Copy } from 'lucide-react';

interface AssistantMessageProps {
  conversationId: string;
}

function AssistantMessage({ conversationId }: AssistantMessageProps) {
  const responseText = useAssistantResponseStream(conversationId);
  const { isStreaming } = useAssistantStreamingContext();

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

      {responseText && !isStreaming && (
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <Copy />
        </Button>
      )}
    </div>
  );
}

export { AssistantMessage };
