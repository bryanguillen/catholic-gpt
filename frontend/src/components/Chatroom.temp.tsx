import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'other';
}

export default function Chatroom() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Hey there! How are you doing today?',
      sender: 'other',
    },
    {
      id: 2,
      content: "I'm doing great, thanks for asking! How about you?",
      sender: 'user',
    },
    {
      id: 3,
      content:
        'Pretty good! Just working on some new projects. Have you seen the latest updates?',
      sender: 'other',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: 'user',
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-background min-h-screen items-center p-4">
      <div className="bg-card text-card-foreground flex h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-lg shadow-lg">
        <div className="border-b p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">CatholicGPT</h2>
          </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="mb-1 whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex w-full items-end space-x-2">
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="E.g. What is the Catholic Church?"
              className="max-h-[10rem] min-h-[2.5rem] flex-1 resize-none"
              rows={1}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
