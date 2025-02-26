import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { ThreadIdInterceptor } from './thread-id.interceptor';
import { ConversationService } from '../services/conversation.service';

describe('ThreadIdInterceptor', () => {
  let interceptor: ThreadIdInterceptor;
  let conversationService: Partial<ConversationService>;

  beforeEach(async () => {
    conversationService = {
      getConversation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThreadIdInterceptor,
        { provide: ConversationService, useValue: conversationService },
      ],
    }).compile();

    interceptor = module.get<ThreadIdInterceptor>(ThreadIdInterceptor);
  });

  it('should not modify request body if no conversationId is present', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ params: {}, body: {} }),
      }),
    } as ExecutionContext;

    const next: CallHandler = {
      handle: jest.fn(() => of({})),
    };

    const result = await interceptor.intercept(context, next);
    result.subscribe(() => {
      expect(context.switchToHttp().getRequest().body.threadId).toBeUndefined();
    });
  });

  it('should add threadId to request body if conversation has a threadId', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ params: { conversationId: '123' }, body: {} }),
      }),
    } as ExecutionContext;

    const next: CallHandler = {
      handle: jest.fn(() => of({})),
    };

    (conversationService.getConversation as jest.Mock).mockResolvedValue({
      threadId: 'thread-123',
    });

    const result = await interceptor.intercept(context, next);
    result.subscribe(() => {
      expect(context.switchToHttp().getRequest().body.threadId).toBe(
        'thread-123',
      );
    });
  });

  it('should not add threadId to request body if conversation does not have a threadId', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ params: { conversationId: '123' }, body: {} }),
      }),
    } as ExecutionContext;

    const next: CallHandler = {
      handle: jest.fn(() => of({})),
    };

    (conversationService.getConversation as jest.Mock).mockResolvedValue(null);

    const result = await interceptor.intercept(context, next);
    result.subscribe(() => {
      expect(context.switchToHttp().getRequest().body.threadId).toBeUndefined();
    });
  });
});
