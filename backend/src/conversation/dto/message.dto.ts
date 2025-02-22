import { SenderType } from '../entities/message.entity';

export class MessageDto {
  id: string;
  content: string;
  conversationId: string;
  createdAt: Date;
  senderType: SenderType;
}
