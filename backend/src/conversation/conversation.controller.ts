import {
  Controller,
  Post,
  Body,
  Param,
  Sse,
  UseGuards,
  UseInterceptors,
  Inject,
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
import { ThreadIdGuard } from './guards/thread-id.guard';
import { ThreadIdInterceptor } from './interceptors/thread-id.interceptor';
import {
  RESPONSE_STREAMED_EVENT,
  ResponseStreamedEvent,
} from './events/response-streamed.event';
import { AssistantServiceI } from './services/assistant/assistant-service.interface';
import { LoggerService } from '../logger/logger.service';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    @Inject('AssistantService')
    private readonly assistantService: AssistantServiceI,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async createConversation(
    @Body() body: CreateConversationDto,
  ): Promise<CreateConversationResponseDto> {
    this.logger.log('Creating conversation', 'ConversationController', {
      body,
    });

    const { appUserId, message } = body;

    const conversation = await this.conversationService.createConversation(
      appUserId,
      message,
    );

    this.logger.log('Conversation created', 'ConversationController', {
      conversation,
    });

    return {
      conversationId: conversation.id,
      firstUserMessage: convertMessageToDto(conversation.messages[0]),
    };
  }

  @Post(':conversationId/message') // interceptor not needed for this one
  @UseGuards(ThreadIdGuard)
  async saveUserMessage(
    @Param('conversationId') conversationId: string,
    @Body() body: SaveUserMessageRequestDto,
  ): Promise<SaveUserMessageResponseDto> {
    this.logger.log('Saving user message', 'ConversationController', {
      conversationId,
      body,
    });

    const message = convertMessageToDto(
      await this.conversationService.saveUserMessage(
        conversationId,
        body.message,
      ),
    );

    this.logger.log('User message saved', 'ConversationController', {
      conversationId,
      message,
    });

    return {
      data: message,
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
          observer.next({ data });
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
