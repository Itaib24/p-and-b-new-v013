import React, { createContext, useContext, useState } from 'react';
import { Message } from '../types/chat';
import { messages as defaultMessages } from '../data/messages';

interface ChatContextType {
  conversations: Record<string, Message[]>;
  sendMessage: (userId: string, text: string) => void;
  receiveReply: (userId: string, text: string) => void;
  getHistory: (userId: string) => Message[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Record<string, Message[]>>({
    '1': defaultMessages
  });

  const appendMessage = (userId: string, text: string) => {
    const message: Message = {
      time: new Date().toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      text
    };
    setConversations(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), message]
    }));
  };

  const sendMessage = (userId: string, text: string) => {
    appendMessage(userId, text);
  };

  const receiveReply = (userId: string, text: string) => {
    appendMessage(userId, text);
  };

  const getHistory = (userId: string): Message[] => conversations[userId] || [];

  return (
    <ChatContext.Provider value={{ conversations, sendMessage, receiveReply, getHistory }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
