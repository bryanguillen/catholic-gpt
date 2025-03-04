import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppUserModule } from './app-user/app-user.module';
import { ConversationModule } from './conversation/conversation.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        ...(configService.get<string>('DB_URL')
          ? {
              url: configService.get<string>('DB_URL'),
            }
          : {
              host: configService.get<string>('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_NAME'),
            }),
        autoLoadEntities: configService.get<boolean>('DB_AUTO_LOAD_ENTITIES'),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    AppUserModule,
    ConversationModule,
    LoggerModule,
  ],
})
export class AppModule {}
