import {
  MessageForm,
  Messages,
  ChatroomContainer,
  EmptyMessages,
} from './components';
import { useConversationMessages } from './hooks/useConversationMessages';

function Home() {
  const { messages, sendMessage, isPending } = useConversationMessages();

  return (
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
  );
}

export { Home };
