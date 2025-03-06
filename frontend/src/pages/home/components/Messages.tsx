import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components';
import { MessageDto, SenderType } from '@/types';
import { AssistantMessage } from './AssistantMessage';
import { MessageContainer } from './MessageContainer';

interface MessagesProps {
  messages: MessageDto[];
}

function Messages({ messages }: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <ScrollArea className="h-full flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map(({ id, senderType, ...message }) =>
          senderType === SenderType.ASSISTANT ? (
            <AssistantMessage
              key={id}
              conversationId={message.conversationId}
            />
          ) : (
            <MessageContainer key={id} senderType={SenderType.USER}>
              {message.content}
            </MessageContainer>
          )
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

export { Messages };
