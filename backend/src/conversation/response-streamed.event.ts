import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConversationService } from './services/conversation.service';

export const RESPONSE_STREAMED_EVENT = 'response.streamed';

export class ResponseStreamedEvent {
  constructor(
    public conversationId: string,
    public assistantResponse: string,
  ) {}
}

@Injectable()
export class ResponseStreamedEventListener {
  constructor(private readonly conversationService: ConversationService) {}

  @OnEvent(RESPONSE_STREAMED_EVENT)
  async handleResponseStreamed(event: ResponseStreamedEvent) {
    await this.conversationService.saveAssistantMessage(
      event.conversationId,
      event.assistantResponse,
    );
  }
}
