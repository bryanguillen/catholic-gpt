import { Message } from './entities/message.entity';
import { MessageDto } from './dto/message.dto';

export const convertMessages = (messages: Message[]): MessageDto[] => {
  return messages.map((message) => ({
    id: message.id,
    content: message.content,
    conversationId: message.conversation.id,
    createdAt: message.createdAt,
    senderType: message.senderType,
  }));
};
