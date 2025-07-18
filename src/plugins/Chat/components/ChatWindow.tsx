import React, { useEffect } from 'react';
import { Message as MessageComponent } from './Message';
import { ChatInput } from './ChatInput';
import { calculateEngagementRate } from '../../../utils/engagementUtils';
import { useChat } from '../../../contexts/ChatContext';

interface ChatWindowProps {
  userId: string;
  onEngagementRateChange?: (rate: number) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  userId,
  onEngagementRateChange
}) => {
  const { sendMessage, getHistory } = useChat();
  const messages = getHistory(userId);

  useEffect(() => {
    const engagementRate = calculateEngagementRate(messages);
    onEngagementRateChange?.(engagementRate);
  }, [messages, onEngagementRateChange]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 transition-colors duration-200">
        {messages.map((msg, idx) => (
          <MessageComponent
            key={idx}
            time={msg.time}
            text={msg.text}
            isBot={!msg.text.includes('OK')}
          />
        ))}
      </div>
      <ChatInput onSendMessage={(text) => sendMessage(userId, text)} />
    </div>
  );
};