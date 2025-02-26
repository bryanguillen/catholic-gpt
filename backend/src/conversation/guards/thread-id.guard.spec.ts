import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { ThreadIdGuard } from './thread-id.guard';
import { ConversationService } from '../services/conversation.service';

const getMockExecutionContext = (conversationId?: string) =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ params: { conversationId } }),
    }),
  }) as ExecutionContext;

describe('ThreadIdGuard', () => {
  let guard: ThreadIdGuard;
  let conversationService: Partial<ConversationService>;

  beforeAll(async () => {
    conversationService = {
      getConversation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThreadIdGuard,
        { provide: ConversationService, useValue: conversationService },
      ],
    }).compile();

    guard = module.get<ThreadIdGuard>(ThreadIdGuard);
  });

  it('should return false if no conversationId is present', async () => {
    const context = getMockExecutionContext();

    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });

  it('should return false if conversation does not have a threadId', async () => {
    const context = getMockExecutionContext('123');

    (conversationService.getConversation as jest.Mock).mockResolvedValue(null);

    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });

  it('should return true if conversation has a threadId', async () => {
    const context = getMockExecutionContext('123');

    (conversationService.getConversation as jest.Mock).mockResolvedValue({
      threadId: 'thread-123',
    });

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });
});
