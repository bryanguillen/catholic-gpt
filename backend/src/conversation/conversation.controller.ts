import { Controller, Post, Body, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateConversationResponseDto } from './dto/create-conversation-response.dto';
import { SaveUserMessageRequestDto } from './dto/save-user-message-request.dto';
import { SaveUserMessageResponseDto } from './dto/save-user-message-response.dto';
import { convertMessageToDto } from './conversation.utils';

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
  async saveUserMessage(
    @Param('conversationId') conversationId: string,
    @Body() body: SaveUserMessageRequestDto,
  ): Promise<SaveUserMessageResponseDto> {
    const message = await this.conversationService.saveUserMessage(
      conversationId,
      body.message,
    );

    return {
      data: convertMessageToDto(message),
    };
  }
}
