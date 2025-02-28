import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
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
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  /**
   * TODO: Cleanup so that the threadId and message are rolledback if transaction fails
   */
  async createConversation(appUserId: string, initialMessageContent: string) {
    const appUser = await this.appUserService.getAppUser(appUserId);

    if (!appUser) {
      throw new NotFoundException('App user not found');
    }

    const threadId = await this.assistantService.createThread();
    await this.assistantService.addUserMessageToThread(
      threadId,
      initialMessageContent,
    );

    return this.dataSource.transaction(async (manager) => {
      const conversation = new Conversation();
      conversation.appUser = appUser;
      conversation.threadId = threadId;

      const savedConversation = await manager.save(Conversation, conversation);

      const message = new Message();
      message.content = initialMessageContent;
      message.conversation = savedConversation;
      message.senderType = SenderType.USER;

      await manager.save(Message, message);

      // Return the conversation with the first message loaded
      savedConversation.messages = [message];

      return savedConversation;
    });
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
      senderType: SenderType.ASSISTANT,
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
