import ReactMarkdown from 'react-markdown';
import { LoadingDots } from '@/components';
import { SenderType } from '@/types';
import { MessageContainer } from '../MessageContainer';
import { useAssistantResponseStream } from './useAssistantResponseStream';
import { Copy } from 'lucide-react';

interface AssistantMessageProps {
  conversationId: string;
}

function AssistantMessage({ conversationId }: AssistantMessageProps) {
  const responseText = useAssistantResponseStream(conversationId);

  const handleCopy = () => {
    if (!responseText) return;
    navigator.clipboard.writeText(responseText);
  };


  return (
    <div className="flex flex-col items-start space-y-2"> 
      <MessageContainer senderType={SenderType.ASSISTANT}>
        {!responseText ? (
          <LoadingDots />
        ) : (
          <ReactMarkdown>{responseText}</ReactMarkdown>
        )}
      </MessageContainer>

      {responseText && (
        <button
          onClick={handleCopy}
          className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <Copy className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export { AssistantMessage };
