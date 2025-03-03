import { useState } from 'react';
import { Send } from 'lucide-react';
import { Textarea, Button } from '@/components';

interface MessageFormProps {
  disabled: boolean;
  handleSendMessage: (message: string) => void;
}

function MessageForm({ disabled, handleSendMessage }: MessageFormProps) {
  const [message, setMessage] = useState('');

  const sendMessageWrapper = () => {
    handleSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageWrapper();
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex w-full items-end space-x-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="E.g. What is the Catholic Church?"
          className="max-h-[10rem] min-h-[2.5rem] flex-1 resize-none"
          rows={1}
          disabled={disabled}
        />
        <Button
          size="icon"
          onClick={sendMessageWrapper}
          disabled={!message.trim() || disabled}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}

export { MessageForm };
