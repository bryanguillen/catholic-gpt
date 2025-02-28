import { useOptimistic, useState, useTransition } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { v4 as uuidv4 } from 'uuid';

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
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [optimisticMessages, setOptimisticMessages] = useOptimistic<
    MessageDto[],
    MessageDto[]
  >(messages, (messages, optimisticMessage) => [
    ...messages,
    ...optimisticMessage,
  ]);

  const [appUserId] = useLocalStorageState('userId');

  const [isPending, startTransition] = useTransition();

  const createConversation = async (message: string) => {
    startTransition(async () => {
      const assistantResponse: MessageDto = {
        id: uuidv4(),
        content: '',
        conversationId: conversationId || '',
        createdAt: new Date().toISOString(),
        senderType: SenderType.ASSISTANT,
      };

      setOptimisticMessages([
        ...optimisticMessages,
        {
          id: uuidv4(),
          content: message,
          conversationId: conversationId || '',
          createdAt: new Date().toISOString(),
          senderType: SenderType.USER,
        },
        assistantResponse,
      ]);

      const request: CreateConversationRequestDto = {
        appUserId: (appUserId || '') as string,
        message,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/conversation`,
        {
          method: 'POST',
          body: JSON.stringify(request),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Could not create conversation');
      }

      const data: CreateConversationResponseDto = await response.json();

      setConversationId(data.conversationId);
      setMessages([
        data.firstUserMessage,
        { ...assistantResponse, conversationId: data.conversationId },
      ]);
    });
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
