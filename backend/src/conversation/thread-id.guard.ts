import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConversationService } from './services/conversation.service';

@Injectable()
export class ThreadIdGuard implements CanActivate {
  constructor(private readonly conversationService: ConversationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const conversationId = request.params.conversationId;

    if (!conversationId) {
      return false;
    }

    const conversation =
      await this.conversationService.getConversation(conversationId);

    return !!conversation?.threadId;
  }
}
