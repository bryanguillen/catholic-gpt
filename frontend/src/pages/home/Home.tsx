import { useState } from 'react';

import MessageForm from './components/MessageForm';
import Messages from './components/Messages';
import ChatroomContainer from './components/ChatroomContainer';
import EmptyMessages from './components/EmptyMessages';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'other';
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Hey there! How are you doing today?',
      sender: 'other',
    },
    {
      id: 2,
      content: "I'm doing great, thanks for asking! How about you?",
      sender: 'user',
    },
    {
      id: 3,
      content:
        'Pretty good! Just working on some new projects. Have you seen the latest updates?',
      sender: 'other',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: 'user',
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <ChatroomContainer>
      {messages.length > 0 ? (
        <Messages messages={messages} />
      ) : (
        <EmptyMessages />
      )}
      <MessageForm
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
      />
    </ChatroomContainer>
  );
}
