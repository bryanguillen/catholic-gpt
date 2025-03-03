import { useOptimistic, useState, useTransition } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { v4 as uuidv4 } from 'uuid';

import {
  MessageDto,
  CreateConversationRequestDto,
  CreateConversationResponseDto,
  SenderType,
  SaveUserMessageRequestDto,
  SaveUserMessageResponseDto,
} from '@/types';

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
  >(messages, (messages, optimisticMessages) => {
    const realIds = new Set(messages.map((item) => item.id));

    /**
     * If duplicate found, means that the optimistic message has been sent and received.
     * Thus, the optimistic message is no longer needed.
     *
     * There is a moment where both the optimistic and real messages will exists, and thus, if we simply
     * merge the optimistic messages, we will have duplicate messages in the UI,
     * which creates problems with the keys for the messages.
     *
     * To avoid this, we return the real messages only if a duplicate is found.
     */
    const duplicateFound = optimisticMessages.some((item) =>
      realIds.has(item.id)
    );

    return duplicateFound
      ? [...messages]
      : [...messages, ...optimisticMessages];
  });

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
        {
          ...assistantResponse,
          conversationId: data.conversationId,
        },
      ]);
    });
  };

  const sendMessageToConversation = async (message: string) => {
    if (!conversationId) return;

    startTransition(async () => {
      const assistantResponse: MessageDto = {
        id: uuidv4(),
        content: '',
        conversationId,
        createdAt: new Date().toISOString(),
        senderType: SenderType.ASSISTANT,
      };

      setOptimisticMessages([
        {
          id: uuidv4(),
          content: message,
          conversationId,
          createdAt: new Date().toISOString(),
          senderType: SenderType.USER,
        },
        assistantResponse,
      ]);

      const request: SaveUserMessageRequestDto = {
        message,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/conversation/${conversationId}/message`,
        {
          method: 'POST',
          body: JSON.stringify(request),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Could not send message to conversation');
      }

      const data: SaveUserMessageResponseDto = await response.json();

      setMessages((prev) => [...prev, data.data, assistantResponse]);
    });
  };

  return {
    conversationId,
    isPending,
    messages: optimisticMessages,
    sendMessage: async (message: string) => {
      if (!conversationId) {
        await createConversation(message);
      } else {
        await sendMessageToConversation(message);
      }
    },
  };
};
