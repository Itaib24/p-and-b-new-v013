import React from 'react';
import { Bot } from 'lucide-react';

interface MessageProps {
  time: string;
  text: string;
  isBot: boolean;
}

export const Message: React.FC<MessageProps> = ({ time, text, isBot }) => {
  const isJsonMessage = text.startsWith('{') && text.endsWith('}');
  if (isJsonMessage) return null;

  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in-up group`}>
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      <div className={`max-w-[80%] ${isBot ? 'order-2' : 'order-1'}`}>
        <div className="text-xs text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {time}
        </div>
        <div
          className={`p-3 rounded-2xl transform hover:scale-102 transition-all duration-300 ${
            isBot
              ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-white rounded-tl-none shadow-lg hover:shadow-xl hover:shadow-gray-900/50 border border-gray-600 hover:border-gray-500'
              : 'bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white rounded-tr-none shadow-lg hover:shadow-xl hover:shadow-blue-900/50 border border-blue-500 hover:border-blue-400'
          } group-hover:-translate-y-0.5`}
        >
          <div className="transform group-hover:scale-102 transition-transform duration-200">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};