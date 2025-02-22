import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { AppUserModule } from '../app-user/app-user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation]), AppUserModule],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
