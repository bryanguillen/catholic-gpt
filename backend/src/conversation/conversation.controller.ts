import { Controller, Post, Body, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateConversationResponseDto } from './dto/create-conversation-response.dto';
import { SendMessageRequestDto } from './dto/send-message-request.dto';
import { SendMessageResponseDto } from './dto/send-message-response.dto';
import { convertMessages } from './conversation.utils';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createConversation(
    @Body() body: CreateConversationDto,
  ): Promise<CreateConversationResponseDto> {
    const conversation = await this.conversationService.createConversation(
      body.appUserId,
    );
    return { id: conversation.id };
  }

  @Post(':conversationId/message')
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Body() body: SendMessageRequestDto,
  ): Promise<SendMessageResponseDto> {
    const messages = await this.conversationService.createMessageResponsePair(
      conversationId,
      body.message,
    );

    return {
      data: convertMessages(messages),
    };
  }
}
