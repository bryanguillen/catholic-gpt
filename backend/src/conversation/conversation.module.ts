import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { AppUserModule } from '../app-user/app-user.module';
import { AssistantService } from './assistant.service';
import { ResponseStreamedEventListener } from './response-streamed.event';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message]), AppUserModule],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    AssistantService,
    ResponseStreamedEventListener,
  ],
})
export class ConversationModule {}
