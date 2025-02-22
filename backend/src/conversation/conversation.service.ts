import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { AppUserService } from '../app-user/app-user.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    private appUserService: AppUserService,
  ) {}

  async createConversation(appUserId: string) {
    const appUser = await this.appUserService.getAppUser(appUserId);

    if (!appUser) {
      throw new NotFoundException('App user not found');
    }

    const conversation = this.conversationRepository.create({
      appUser,
    });

    return this.conversationRepository.save(conversation);
  }
}
