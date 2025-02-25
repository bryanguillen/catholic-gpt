import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

// eslint-disable-next-line
const asyncRetry = require('async-retry');

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

  async createThread() {
    const response = await this.openai.beta.threads.create();
    return response.id;
  }

  async getResponse(threadId: string, message: string) {
    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    const runResponse = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistantId,
    });

    // Poll the run until it completes
    await this.waitForRunToComplete(threadId, runResponse.id);

    const messages = await this.openai.beta.threads.messages.list(threadId, {
      limit: 2,
    });

    const messageResponse = messages.data[1];

    return messageResponse.content[0].type === 'text'
      ? messageResponse.content[0].text.value
      : 'Response not available';
  }

  async addUserMessageToThread(threadId: string, message: string) {
    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });
  }

  private async waitForRunToComplete(threadId: string, runId: string) {
    return asyncRetry(
      async () => {
        const statusResponse = await this.openai.beta.threads.runs.retrieve(
          threadId,
          runId,
        );
        if (statusResponse.status !== 'completed') {
          throw new Error('Run not completed');
        }
        return statusResponse.status;
      },
      {
        retries: 10,
        factor: 2,
        minTimeout: 500,
        maxTimeout: 1000,
      },
    );
  }
}
