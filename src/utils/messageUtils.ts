import { messages } from '../data/messages';

export const getLastMessageDate = (userId: string): Date | null => {
  // Filter out system messages (JSON strings) and get user messages
  const userMessages = messages.filter(msg => !msg.text.startsWith('{'));
  
  if (userMessages.length === 0) {
    return null;
  }

  // Get the last message date
  return new Date(userMessages[userMessages.length - 1].time);
};