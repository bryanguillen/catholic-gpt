import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'other';
}

interface MessagesProps {
  messages: Message[];
}

export default function Messages({ messages }: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map(({ id, ...message }) => (
          <Message key={id} {...message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

function Message({ sender, content }: Omit<Message, 'id'>) {
  return (
    <div
      className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[90%] rounded-lg px-4 py-2 ${sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
      >
        <div className="mb-1 whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  );
}
