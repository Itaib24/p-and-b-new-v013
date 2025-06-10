import { User } from '../types/user';
import { getOverviewById } from '../data/overview';
import { messages } from '../data/messages';

export const needsAttention = (user: User): { needs: boolean; reason: string | null } => {
  const userOverview = getOverviewById(user.id);
  
  // Check engagement level
  if (userOverview.engagementLevel < 70) {
    return { 
      needs: true, 
      reason: `Low engagement level: ${userOverview.engagementLevel}%` 
    };
  }

  // Check weekly intensity
  if (userOverview.weeklyIntensity < 60) {
    return { 
      needs: true, 
      reason: `Low weekly intensity: ${userOverview.weeklyIntensity}%` 
    };
  }

  // Check missed check-ins
  const missedCheckIns = calculateMissedCheckIns(user.id);
  if (missedCheckIns > 1) {
    return { 
      needs: true, 
      reason: `Missed ${missedCheckIns} scheduled check-ins` 
    };
  }

  return { needs: false, reason: null };
};

const calculateMissedCheckIns = (userId: string): number => {
  // Get messages for this user
  const userMessages = messages.filter(msg => !msg.text.startsWith('{'));
  
  let missedCheckIns = 0;
  let lastMessageDate = null;

  for (let i = 0; i < userMessages.length; i++) {
    const currentDate = new Date(userMessages[i].time);
    
    if (lastMessageDate) {
      const diffDays = Math.floor((currentDate.getTime() - lastMessageDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 7) { // Consider it a missed check-in if gap is more than 7 days
        missedCheckIns++;
      }
    }
    
    lastMessageDate = currentDate;
  }

  return missedCheckIns;
};