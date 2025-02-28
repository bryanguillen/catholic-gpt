/**
 * API types repeated here for this initial implementation
 * Eventually, we'll want to move these to a shared package or
 * reimplement them so that we can generate them from the backend
 */

export interface CreateConversationResponseDto {
  conversationId: string;
  firstUserMessage: MessageDto;
}

export interface CreateConversationRequestDto {
  appUserId: string;
  message: string;
}

export interface MessageDto {
  id: string;
  content: string;
  conversationId: string;
  createdAt: string;
  senderType: SenderType;
}

export enum SenderType {
  USER = 'user',
  ASSISTANT = 'assistant',
}
