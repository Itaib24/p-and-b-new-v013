import React from 'react';
import { User } from '../../types/user';
import { AlertCard } from './AlertCard';
import { getOverviewById } from '../../data/overview';
import { needsAttention } from '../../utils/attentionStatus';
import { calculateUserPerformance } from '../../utils/userPerformance';
import { getLastMessageDate } from '../../utils/messageUtils';

interface AlertSectionProps {
  users: User[];
  onUserSelect: (userId: string) => void;
}

export const AlertSection: React.FC<AlertSectionProps> = ({ users, onUserSelect }) => {
  const attentionRequired = users.filter(user => {
    const attentionStatus = needsAttention(user);
    return attentionStatus.needs;
  });

  const lowPerformance = users.filter(user => {
    const userOverview = getOverviewById(user.id);
    const performance = calculateUserPerformance(
      userOverview.engagementLevel,
      userOverview.progressLevel,
      userOverview.weeklyIntensity || 0
    );
    return performance < 70;
  });
  
  const usersWithDueResponse = users.filter(user => {
    const lastMessageDate = getLastMessageDate(user.id);
    if (!lastMessageDate) return false;
    
    const now = new Date();
    const diffInDays = (now.getTime() - lastMessageDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays >= 7;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <AlertCard
        title="דורש תשומת לב"
        count={attentionRequired.length}
        type="attention"
        users={attentionRequired}
        onUserSelect={onUserSelect}
      />
      <AlertCard
        title="ביצועים נמוכים"
        count={lowPerformance.length}
        type="performance"
        users={lowPerformance}
        onUserSelect={onUserSelect}
      />
      <AlertCard
        title="אין תגובה 7+ ימים"
        count={usersWithDueResponse.length}
        type="overdue"
        users={usersWithDueResponse}
        onUserSelect={onUserSelect}
      />
    </div>
  );
};