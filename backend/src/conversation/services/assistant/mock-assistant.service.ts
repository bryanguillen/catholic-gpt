import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
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
      observer.next('Mock response');
      observer.complete();
    });
  }
}
