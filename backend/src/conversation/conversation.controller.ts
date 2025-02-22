import { Controller, Post, Body } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './create-conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createConversation(@Body() body: CreateConversationDto) {
    const conversation = await this.conversationService.createConversation(
      body.appUserId,
    );
    return { id: conversation.id };
  }
}
