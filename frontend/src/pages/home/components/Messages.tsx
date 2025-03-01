import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageDto, SenderType } from '../types';
import { AssistantMessage } from './AssistantMessage';
interface MessagesProps {
  messages: MessageDto[];
}

export default function Messages({ messages }: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <ScrollArea className="h-full flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map(({ id, ...message }) => (
          <MessageContainer key={id} {...message}>
            {message.senderType === SenderType.ASSISTANT ? (
              <AssistantMessage conversationId={message.conversationId} />
            ) : (
              message.content
            )}
          </MessageContainer>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

interface MessageContainerProps {
  children: string | React.ReactNode;
  senderType: SenderType;
}

function MessageContainer({ senderType, children }: MessageContainerProps) {
  return (
    <div
      className={`flex ${senderType === SenderType.USER ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[90%] rounded-lg px-4 py-2 ${senderType === SenderType.USER ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
      >
        <div className="mb-1 whitespace-pre-wrap">{children}</div>
      </div>
    </div>
  );
}
