import { Observable } from 'rxjs';

export interface AssistantServiceI {
  addUserMessageToThread(threadId: string, message: string): Promise<void>;
  createThread(): Promise<string>;
  streamThreadResponse(threadId: string): Observable<string>;
}
