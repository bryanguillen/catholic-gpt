import { Message } from './entities/message.entity';
import { MessageDto } from './dto/message.dto';

export const convertMessageToDto = (message: Message): MessageDto => {
  return {
    id: message.id,
    content: message.content,
    conversationId: message.conversation.id,
    createdAt: message.createdAt,
    senderType: message.senderType,
  };
};
