import { useState } from 'react';

import MessageForm from './components/MessageForm';
import Messages from './components/Messages';
import ChatroomContainer from './components/ChatroomContainer';
import EmptyMessages from './components/EmptyMessages';
import { useConversationMessages } from './useConversationMessages';

export default function Home() {
  const [newMessage, setNewMessage] = useState('');
  const { messages, sendMessage, isPending } = useConversationMessages();

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    setNewMessage('');
    sendMessage(newMessage);
  };

  return (
    <ChatroomContainer>
      {messages.length > 0 ? (
        <Messages messages={messages} />
      ) : (
        <EmptyMessages />
      )}
      <MessageForm
        disabled={isPending}
        handleSendMessage={handleSendMessage}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
      />
    </ChatroomContainer>
  );
}
