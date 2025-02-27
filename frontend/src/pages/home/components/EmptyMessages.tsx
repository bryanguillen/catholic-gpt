import { MessageSquare } from 'lucide-react';

export default function EmptyMessages() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
      <MessageSquare className="text-muted-foreground mb-4 h-12 w-12" />
      <h1 className="mb-2 text-xl font-semibold">What can I help answer?</h1>
    </div>
  );
}
