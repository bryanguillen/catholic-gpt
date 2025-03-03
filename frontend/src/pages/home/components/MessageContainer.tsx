import { SenderType } from '../types';

interface MessageContainerProps {
  children: string | React.ReactNode;
  senderType: SenderType;
}

export default function MessageContainer({
  senderType,
  children,
}: MessageContainerProps) {
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
