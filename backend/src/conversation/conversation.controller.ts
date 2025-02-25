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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConversationService } from './services/conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateConversationResponseDto } from './dto/create-conversation-response.dto';
import { SaveUserMessageRequestDto } from './dto/save-user-message-request.dto';
import { SaveUserMessageResponseDto } from './dto/save-user-message-response.dto';
import { StreamAssistantResponseDto } from './dto/stream-assistant-response.dto';
import { convertMessageToDto } from './conversation.utils';
import { AssistantService } from './services/assistant.service';
import { ThreadIdGuard } from './guards/thread-id.guard';
import { ThreadIdInterceptor } from './interceptors/thread-id.interceptor';
import {
  RESPONSE_STREAMED_EVENT,
  ResponseStreamedEvent,
} from './events/response-streamed.event';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly assistantService: AssistantService,
    private readonly eventEmitter: EventEmitter2,
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
    const { threadId } = body;

    return new Observable((observer) => {
      let response = '';

      this.assistantService.streamThreadResponse(threadId).subscribe({
        next: (data) => {
          response += data;
          observer.next({ data: response });
        },
        complete: () => {
          this.eventEmitter.emit(
            RESPONSE_STREAMED_EVENT,
            new ResponseStreamedEvent(conversationId, response),
          );
          observer.complete();
        },
        error: (error) => observer.error(error),
      });
    });
  }
}
