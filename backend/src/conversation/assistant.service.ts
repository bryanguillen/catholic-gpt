import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AssistantService {
  private openai: OpenAI;
  private assistantId: string;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.assistantId = this.configService.get<string>('OPENAI_ASSISTANT_ID');
  }

  async addUserMessageToThread(threadId: string, message: string) {
    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });
  }

  async createThread() {
    const response = await this.openai.beta.threads.create();
    return response.id;
  }
}
