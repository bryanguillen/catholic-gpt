import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConversationService } from './services/conversation.service';

@Injectable()
export class ThreadIdInterceptor implements NestInterceptor {
  constructor(private readonly conversationService: ConversationService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const conversationId = request.params.conversationId;

    if (conversationId) {
      const conversation =
        await this.conversationService.getConversation(conversationId);

      // Add threadId to the request body
      request.body.threadId = conversation?.threadId;
    }

    return next.handle();
  }
}
