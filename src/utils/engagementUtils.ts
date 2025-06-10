import { Message } from '../types/chat';

const THRESHOLD_TIME = 120; // 2 hours in minutes

export const calculateEngagementRate = (messages: Message[]): number => {
  if (messages.length < 2) return 0;

  // Calculate average response time
  let totalResponseTime = 0;
  let responseCount = 0;

  for (let i = 1; i < messages.length; i++) {
    const currentMsg = new Date(messages[i].time);
    const prevMsg = new Date(messages[i - 1].time);
    const diffInMinutes = (currentMsg.getTime() - prevMsg.getTime()) / (1000 * 60);
    
    if (diffInMinutes <= THRESHOLD_TIME) {
      totalResponseTime += diffInMinutes;
      responseCount++;
    }
  }

  const averageResponseTime = responseCount > 0 ? totalResponseTime / responseCount : THRESHOLD_TIME;
  
  // Calculate response rate
  const responseRate = responseCount / (messages.length - 1);
  
  // Calculate engagement rate
  const engagementRate = (1 - (averageResponseTime / THRESHOLD_TIME)) * responseRate * 100;
  
  return Math.max(0, Math.min(100, engagementRate)); // Ensure result is between 0-100
};