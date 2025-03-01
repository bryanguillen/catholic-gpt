import MessageForm from './components/MessageForm';
import Messages from './components/Messages';
import ChatroomContainer from './components/ChatroomContainer';
import EmptyMessages from './components/EmptyMessages';
import { useConversationMessages } from './useConversationMessages';

export default function Home() {
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
