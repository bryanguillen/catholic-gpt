import { MessageDto } from '@/types';

export const optimisticConversationMessageReducer = (
  messages: MessageDto[],
  optimisticMessages: MessageDto[]
) => {
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

  return duplicateFound ? [...messages] : [...messages, ...optimisticMessages];
};
