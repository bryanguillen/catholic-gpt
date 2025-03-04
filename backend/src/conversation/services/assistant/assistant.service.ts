import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Observable } from 'rxjs';

import { AssistantServiceI } from './assistant-service.interface';
import { LoggerService } from '../../../logger/logger.service';

@Injectable()
export class AssistantService implements AssistantServiceI {
  private openai: OpenAI;
  private assistantId: string;

  constructor(
    private configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.assistantId = this.configService.get<string>('OPENAI_ASSISTANT_ID');
  }

  async addUserMessageToThread(threadId: string, message: string) {
    try {
      await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message,
      });
    } catch (error) {
      this.logger.error(
        'Error adding user message to thread',
        'AssistantService',
        { error },
      );
      throw error;
    }
  }

  async createThread() {
    try {
      const response = await this.openai.beta.threads.create();
      return response.id;
    } catch (error) {
      this.logger.error('Error creating thread', 'AssistantService', { error });
      throw error;
    }
  }

  streamThreadResponse(threadId: string): Observable<string> {
    return new Observable((observer) => {
      const assistantId = this.assistantId;

      this.logger.log('Streaming thread response', 'AssistantService', {
        threadId,
      });

      const runStream = this.openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId,
      });

      runStream
        .on('textDelta', (textDelta) => observer.next(textDelta.value))
        .on('textDone', () => observer.next('[DONE]'))
        .on('end', () => {
          this.logger.log('Thread response stream ended', 'AssistantService', {
            threadId,
          });
          observer.complete();
        })
        .on('error', (error) => observer.error(error));

      return () => {
        runStream.abort();
      };
    });
  }
}
