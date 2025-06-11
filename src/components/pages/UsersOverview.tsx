import React, { useState } from 'react';
import { UserTable } from '../users/UserTable';
import { AlertSection } from '../users/AlertSection';
import { FilterBar } from '../users/FilterBar';
import { StatisticCards } from '../users/StatisticCards';
import { AdminPanel } from '../users/AdminPanel';
import { ChangeAlertsContainer } from '../trainer/ChangeAlertsContainer';
import { useProgress } from '../../contexts/ProgressTrackingContext';
import { users as initialUsers } from '../../data/users';

interface UsersOverviewProps {
  onUserSelect: (userId: string) => void;
}

export const UsersOverview: React.FC<UsersOverviewProps> = ({ onUserSelect }) => {
  const [users, setUsers] = useState(initialUsers);
  const [filters, setFilters] = useState({
    status: 'all',
    performance: 'all',
    team: 'all',
    dateRange: 'all'
  });
  
  const { 
    recommendations, 
    acceptRecommendation, 
    rejectRecommendation, 
    overrideRecommendation,
    editAndAcceptRecommendation
  } = useProgress();

  const handleAddUser = (userData: any) => {
    const newUser = {
      id: (users.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      status: 'active',
      performance: 0,
      team: userData.team,
      lastActive: new Date().toISOString().split('T')[0],
      overdueTasks: 0,
      attentionNote: null
    };

    setUsers([...users, newUser]);
  };

  return (
    <div className="space-y-6">
      {/* Change Alerts Section */}
      <ChangeAlertsContainer
        users={users}
        recommendations={recommendations}
        onAccept={acceptRecommendation}
        onReject={rejectRecommendation}
        onOverride={overrideRecommendation}
        onEditAndAccept={editAndAcceptRecommendation}
      />
      
      <AdminPanel onAddUser={handleAddUser} />
      <StatisticCards users={users} />
      <AlertSection users={users} onUserSelect={onUserSelect} />
      <FilterBar filters={filters} onFilterChange={setFilters} />
      <UserTable users={users} filters={filters} onUserSelect={onUserSelect} />
    </div>
  );
};