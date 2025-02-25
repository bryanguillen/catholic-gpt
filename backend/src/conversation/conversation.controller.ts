import {
  Controller,
  Post,
  Body,
  Param,
  Sse,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateConversationResponseDto } from './dto/create-conversation-response.dto';
import { SaveUserMessageRequestDto } from './dto/save-user-message-request.dto';
import { SaveUserMessageResponseDto } from './dto/save-user-message-response.dto';
import { convertMessageToDto } from './conversation.utils';
import { AssistantService } from './assistant.service';
import { ThreadIdGuard } from './thread-id.guard';
import { ConversationMetadataInterceptor } from './conversation-metadata.interceptor';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly assistantService: AssistantService,
  ) {}

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
  @UseInterceptors(ConversationMetadataInterceptor)
  @UseGuards(ThreadIdGuard)
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

  @Sse(':conversationId/stream')
  @UseInterceptors(ConversationMetadataInterceptor)
  @UseGuards(ThreadIdGuard)
  streamAssistantResponse(
    @Param('conversationId') conversationId: string,
  ): Observable<{ data: string }> {
    return new Observable((observer) => {
      this.assistantService.streamThreadResponse(conversationId).subscribe({
        next: (data) => observer.next({ data }),
        complete: () => observer.complete(),
        error: (error) => observer.error(error),
      });
    });
  }
}
