import { MessageDto } from './message.dto';

export class CreateConversationResponseDto {
  conversationId: string;
  firstUserMessage: MessageDto;
}
