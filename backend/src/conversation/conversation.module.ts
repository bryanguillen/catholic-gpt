import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './services/conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { AppUserModule } from '../app-user/app-user.module';
import { AssistantService } from './services/assistant/assistant.service';
import { MockAssistantService } from './services/assistant/mock-assistant.service';
import { ResponseStreamedEventListener } from './events/response-streamed.event';
import { LoggerService } from '../logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message]), AppUserModule],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    {
      provide: 'AssistantService',
      useFactory: (configService: ConfigService, logger: LoggerService) => {
        const service = !!configService.get<string>('OPENAI_API_KEY')
          ? AssistantService
          : MockAssistantService;
        return new service(configService, logger);
      },
      inject: [ConfigService, LoggerService],
    },
    ResponseStreamedEventListener,
  ],
})
export class ConversationModule {}
