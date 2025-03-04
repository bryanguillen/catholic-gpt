import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import * as readline from 'readline';
import { AssistantServiceI } from './assistant-service.interface';

@Injectable()
export class MockAssistantService implements AssistantServiceI {
  async addUserMessageToThread(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    threadId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    message: string,
  ): Promise<void> {
    return;
  }

  async createThread(): Promise<string> {
    return 'mock-thread-id';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  streamThreadResponse(threadId: string): Observable<string> {
    return new Observable((observer) => {
      const fileStream = fs.createReadStream('./mock.md');
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      rl.on('line', (line) => {
        observer.next(line);
      });

      rl.on('close', () => {
        observer.complete();
      });

      rl.on('error', (error) => {
        observer.error(error);
      });

      return () => {
        rl.close();
      };
    });
  }
}
