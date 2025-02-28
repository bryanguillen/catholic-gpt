import { useOptimistic, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import {
  MessageDto,
  CreateConversationRequestDto,
  CreateConversationResponseDto,
  SenderType,
} from './types';

interface UseConversationMessagesResults {
  conversationId: string | null;
  isPending: boolean;
  messages: MessageDto[];
  sendMessage: (message: string) => Promise<void>;
}

export const useConversationMessages = (): UseConversationMessagesResults => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [optimisticMessages, setOptimisticMessages] = useOptimistic<
    MessageDto[],
    MessageDto
  >(messages, (messages, optimisticMessage) => [
    ...messages,
    optimisticMessage,
  ]);

  const [appUserId] = useLocalStorageState('appUserId');

  const createConversation = async (message: string) => {
    try {
      setOptimisticMessages({
        id: 'optimistic-id',
        content: message,
        conversationId: conversationId || '',
        createdAt: new Date().toISOString(),
        senderType: SenderType.USER,
      });
      setIsPending(true);

      const request: CreateConversationRequestDto = {
        appUserId: (appUserId || '') as string,
        message,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/conversation`,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error('Could not create conversation');
      }

      const data: CreateConversationResponseDto = await response.json();

      setConversationId(data.conversationId);
      setMessages([data.firstUserMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return {
    conversationId,
    isPending,
    messages: optimisticMessages,
    sendMessage: async (message: string) => {
      createConversation(message);
    },
  };
};
