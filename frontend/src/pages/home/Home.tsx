import {
  MessageForm,
  Messages,
  ChatroomContainer,
  EmptyMessages,
} from './components';
import { useConversationMessages } from './hooks/useConversationMessages';
import { AssistantStreamingProvider } from './context/AssistantStreamingContext';

function Home() {
  const { messages, sendMessage, isPending } = useConversationMessages();

  return (
    <AssistantStreamingProvider>
      <ChatroomContainer>
        {messages.length > 0 ? (
          <Messages messages={messages} />
        ) : (
          <EmptyMessages />
        )}
        <MessageForm
          disabled={isPending}
          handleSendMessage={(message) => sendMessage(message)}
        />
      </ChatroomContainer>
    </AssistantStreamingProvider>
  );
}

export { Home };
