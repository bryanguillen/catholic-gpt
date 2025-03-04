import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message, SenderType } from '../entities/message.entity';
import { AppUserService } from '../../app-user/app-user.service';
import { AssistantServiceI } from './assistant/assistant-service.interface';
import { LoggerService } from '../../logger/logger.service';
@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private appUserService: AppUserService,
    @Inject('AssistantService')
    private assistantService: AssistantServiceI,
    @InjectDataSource() private dataSource: DataSource,
    private readonly logger: LoggerService,
  ) {}

  /**
   * TODO: Cleanup so that the threadId and message are rolledback if transaction fails
   */
  async createConversation(appUserId: string, initialMessageContent: string) {
    try {
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

        const savedConversation = await manager.save(
          Conversation,
          conversation,
        );

        const message = new Message();
        message.content = initialMessageContent;
        message.conversation = savedConversation;
        message.senderType = SenderType.USER;

        await manager.save(Message, message);

        // Return the conversation with the first message loaded
        savedConversation.messages = [message];

        return savedConversation;
      });
    } catch (error) {
      this.logger.error('Error creating conversation', 'ConversationService', {
        error,
      });
      throw error;
    }
  }

  async getConversation(conversationId: string): Promise<Conversation> | null {
    try {
      return await this.conversationRepository.findOne({
        where: { id: conversationId },
      });
    } catch (error) {
      this.logger.error('Error getting conversation', 'ConversationService', {
        error,
      });
      throw error;
    }
  }

  async saveAssistantMessage(conversationId: string, message: string) {
    try {
      const assistantMsg = this.messageRepository.create({
        conversation: { id: conversationId },
        content: message,
        senderType: SenderType.ASSISTANT,
      });

      return await this.messageRepository.save(assistantMsg);
    } catch (error) {
      this.logger.error(
        'Error saving assistant message',
        'ConversationService',
        { error },
      );
      throw error;
    }
  }

  async saveUserMessage(conversationId: string, message: string) {
    try {
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
    } catch (error) {
      this.logger.error('Error saving user message', 'ConversationService', {
        error,
      });
      throw error;
    }
  }
}
