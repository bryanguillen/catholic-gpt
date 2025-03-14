import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useConversationMessages } from './useConversationMessages';

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

describe('useConversationMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => useConversationMessages());

    expect(result.current.conversationId).toBeNull();
    expect(result.current.isPending).toBe(false);
    expect(result.current.messages).toEqual([]);
  });

  test('creates a new conversation when sending a message without an existing conversation', async () => {
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          conversationId: 'new-conversation-id',
          firstUserMessage: { id: '1', content: 'Hello', senderType: 'USER' },
        }),
      })
    );

    const { result } = renderHook(() => useConversationMessages());

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.conversationId).toBe('new-conversation-id');
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].content).toBe('Hello');
  });

  test('sends a message to an existing conversation', async () => {
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          conversationId: 'new-conversation-id',
          firstUserMessage: { id: '1', content: 'Hello', senderType: 'USER' },
        }),
      })
    );

    const { result } = renderHook(() => useConversationMessages());

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          data: { id: '2', content: 'Hi there', senderType: 'USER' },
        }),
      })
    );

    await act(async () => {
      await result.current.sendMessage('Hi there');
    });

    expect(result.current.messages).toHaveLength(4);
    expect(result.current.messages[2].content).toBe('Hi there');
  });
});
