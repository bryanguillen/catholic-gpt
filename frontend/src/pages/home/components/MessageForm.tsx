import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface MessageFormProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
}

export default function MessageForm({
  newMessage,
  setNewMessage,
  handleSendMessage,
}: MessageFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex w-full items-end space-x-2">
        <Textarea
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
  );
}
