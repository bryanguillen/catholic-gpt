import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConversationService } from './conversation.service';

@Injectable()
export class ConversationMetadataInterceptor implements NestInterceptor {
  constructor(private readonly conversationService: ConversationService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const conversationId = request.params.conversationId;

    const conversation =
      await this.conversationService.getConversation(conversationId);

    // Add threadId to the request body
    request.body.threadId = conversation.threadId ?? null;

    return next.handle(); // No need to modify the response
  }
}
