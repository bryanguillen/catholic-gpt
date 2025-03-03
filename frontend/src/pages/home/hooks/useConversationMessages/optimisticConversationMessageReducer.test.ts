import { describe, it, expect } from 'vitest';
import { MessageDto, SenderType } from '@/types';
import { optimisticConversationMessageReducer } from './optimisticConversationMessageReducer';

describe('optimisticConversationMessageReducer', () => {
  const realMessages: MessageDto[] = [
    {
      id: '1',
      content: 'Hello',
      conversationId: 'conv1',
      createdAt: '2023-10-01T10:00:00Z',
      senderType: SenderType.USER,
    },
    {
      id: '2',
      content: 'Hi',
      conversationId: 'conv1',
      createdAt: '2023-10-01T10:01:00Z',
      senderType: SenderType.ASSISTANT,
    },
  ];

  const optimisticMessages: MessageDto[] = [
    {
      id: '3',
      content: 'How are you?',
      conversationId: 'conv1',
      createdAt: '2023-10-01T10:02:00Z',
      senderType: SenderType.USER,
    },
    {
      id: '2',
      content: 'Hi',
      conversationId: 'conv1',
      createdAt: '2023-10-01T10:01:00Z',
      senderType: SenderType.ASSISTANT,
    }, // Duplicate
  ];

  it('should return only real messages if a duplicate is found', () => {
    const result = optimisticConversationMessageReducer(
      realMessages,
      optimisticMessages
    );
    expect(result).toEqual(realMessages);
  });

  it('should merge optimistic messages if no duplicates are found', () => {
    const newOptimisticMessages: MessageDto[] = [
      {
        id: '3',
        content: 'How are you?',
        conversationId: 'conv1',
        createdAt: '2023-10-01T10:02:00Z',
        senderType: SenderType.USER,
      },
    ];
    const result = optimisticConversationMessageReducer(
      realMessages,
      newOptimisticMessages
    );
    expect(result).toEqual([...realMessages, ...newOptimisticMessages]);
  });

  it('should handle empty optimistic messages', () => {
    const result = optimisticConversationMessageReducer(realMessages, []);
    expect(result).toEqual(realMessages);
  });

  it('should handle empty real messages', () => {
    const result = optimisticConversationMessageReducer([], optimisticMessages);
    expect(result).toEqual(optimisticMessages);
  });

  it('should return an empty array if both inputs are empty', () => {
    const result = optimisticConversationMessageReducer([], []);
    expect(result).toEqual([]);
  });
});
