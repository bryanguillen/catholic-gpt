import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message, SenderType } from '../entities/message.entity';
import { AppUserService } from '../../app-user/app-user.service';
import { AssistantService } from './assistant.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private appUserService: AppUserService,
    private assistantService: AssistantService,
  ) {}

  async createConversation(appUserId: string) {
    const appUser = await this.appUserService.getAppUser(appUserId);

    if (!appUser) {
      throw new NotFoundException('App user not found');
    }

    const conversation = this.conversationRepository.create({
      appUser,
      threadId: await this.assistantService.createThread(),
    });

    return await this.conversationRepository.save(conversation);
  }

  async getConversation(conversationId: string): Promise<Conversation> | null {
    return await this.conversationRepository.findOne({
      where: { id: conversationId },
    });
  }

  async saveAssistantMessage(conversationId: string, message: string) {
    const assistantMsg = this.messageRepository.create({
      conversation: { id: conversationId },
      content: message,
      senderType: SenderType.BOT,
    });

    return await this.messageRepository.save(assistantMsg);
  }

  async saveUserMessage(conversationId: string, message: string) {
    const conversation = await this.getConversation(conversationId);

    await this.assistantService.addUserMessageToThread(
      conversation.threadId,
      message,
    );

    const userMsg = this.messageRepository.create({
      conversation: { id: conversationId },
      content: message,
      senderType: SenderType.USER,
    });

    return await this.messageRepository.save(userMsg);
  }
}
