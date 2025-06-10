import React, { useState } from 'react';
import { UserTable } from '../users/UserTable';
import { AlertSection } from '../users/AlertSection';
import { FilterBar } from '../users/FilterBar';
import { StatisticCards } from '../users/StatisticCards';
import { AdminPanel } from '../users/AdminPanel';
import { FinancialMetrics } from '../users/FinancialMetrics';
import { ChangeAlertsContainer } from '../trainer/ChangeAlertsContainer';
import { useProgress } from '../../contexts/ProgressTrackingContext';
import { users as initialUsers } from '../../data/users';
import { DollarSign, Users, Briefcase } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'users' | 'financial'>('users');
  
  const { recommendations, acceptRecommendation, rejectRecommendation, overrideRecommendation } = useProgress();

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
    <div>
      {/* Prominent Tab Switcher */}
      <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg p-4 mb-8 sticky top-0 z-10 border-b border-gray-700">
        <div className="flex justify-center max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-lg transform scale-105 border border-purple-500'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent'
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="text-base">User Management</span>
          </button>
          <div className="w-4"></div>
          <button
            onClick={() => setActiveTab('financial')}
            className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 ${
              activeTab === 'financial'
                ? 'bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg transform scale-105 border border-green-500'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent'
            }`}
          >
            <DollarSign className="h-5 w-5" />
            <span className="text-base">Business Metrics</span>
          </button>
        </div>
      </div>
      
      {activeTab === 'users' && (
        <>
          {/* Change Alerts Section */}
          <ChangeAlertsContainer
            users={users}
            recommendations={recommendations}
            onAccept={acceptRecommendation}
            onReject={rejectRecommendation}
            onOverride={overrideRecommendation}
          />
          
          <AdminPanel onAddUser={handleAddUser} />
          <StatisticCards users={users} />
          <AlertSection users={users} onUserSelect={onUserSelect} />
          <FilterBar filters={filters} onFilterChange={setFilters} />
          <UserTable users={users} filters={filters} onUserSelect={onUserSelect} />
        </>
      )}
      
      {activeTab === 'financial' && (
        <FinancialMetrics />
      )}
    </div>
  );
};