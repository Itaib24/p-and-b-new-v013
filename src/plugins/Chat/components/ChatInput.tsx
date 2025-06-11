import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex gap-2 group">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 text-sm border-2 border-gray-600 rounded-full bg-gray-800/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-opacity-50 placeholder-gray-400 text-white transition-all duration-300 group-hover:border-gray-500 shadow-inner"
        />
        <button
          type="submit"
          className="p-3 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white hover:from-blue-500 hover:via-blue-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-110 hover:rotate-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-opacity-50 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:transition-none"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </div>
    </form>
  );
};