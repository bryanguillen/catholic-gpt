import { useOptimistic, useState, useTransition } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import {
  MessageDto,
  CreateConversationRequestDto,
  CreateConversationResponseDto,
  SenderType,
  SaveUserMessageRequestDto,
  SaveUserMessageResponseDto,
} from '@/types';
import { logErrorInDev } from '@/lib/utils';
import { optimisticConversationMessageReducer } from './optimisticConversationMessageReducer';

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
  >(messages, optimisticConversationMessageReducer);

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
      try {
        if (!conversationId) {
          await createConversation(message);
        } else {
          await sendMessageToConversation(message);
        }
      } catch (error) {
        logErrorInDev('error: ', error);
        if (!conversationId) {
          toast.error('Failed to create conversation', {
            description: 'Refresh your screen and try again.',
          });
        } else {
          toast.error('Failed to send message', {
            description:
              'Try again. If persistent, please share this with the team.',
          });
        }
      }
    },
  };
};
