export const RESPONSE_STREAMED_EVENT = 'response.streamed';

export class ResponseStreamedEvent {
  constructor(
    public threadId: string,
    public assistantResponse: string,
  ) {}
}
