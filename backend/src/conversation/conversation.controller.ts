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
import { StreamAssistantResponseDto } from './dto/stream-assistant-response.dto';
import { convertMessageToDto } from './conversation.utils';
import { AssistantService } from './assistant.service';
import { ThreadIdGuard } from './thread-id.guard';
import { ThreadIdInterceptor } from './thread-id.interceptor';

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

  @Post(':conversationId/message') // interceptor not needed for this one
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
  @UseGuards(ThreadIdGuard)
  @UseInterceptors(ThreadIdInterceptor)
  streamAssistantResponse(
    @Param('conversationId') conversationId: string,
    @Body() body: { threadId: string },
  ): Observable<StreamAssistantResponseDto> {
    return new Observable((observer) => {
      this.assistantService.streamThreadResponse(body.threadId).subscribe({
        next: (data) => observer.next({ data }),
        complete: () => observer.complete(),
        error: (error) => observer.error(error),
      });
    });
  }
}
