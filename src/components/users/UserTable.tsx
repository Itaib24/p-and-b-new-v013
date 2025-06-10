import React from 'react';
import { User } from '../../types/user';
import { StatusBadge } from './StatusBadge';
import { getOverviewById } from '../../data/overview';
import { calculateUserPerformance } from '../../utils/userPerformance';
import { getLastMessageDate } from '../../utils/messageUtils';
import { formatDate } from '../../utils/dateUtils';
import { Trophy, ChevronLeft, Medal, Crown, Award } from 'lucide-react';

interface UserTableProps {
  users: User[];
  filters: {
    status: string;
    performance: string;
    team: string;
    dateRange: string;
  };
  onUserSelect: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, filters, onUserSelect }) => {
  const filteredUsers = users.filter(user => {
    if (filters.status !== 'all' && user.status !== filters.status) {
      return false;
    }
    
    const userOverview = getOverviewById(user.id);
    const performance = calculateUserPerformance(
      userOverview.engagementLevel,
      userOverview.progressLevel,
      userOverview.weeklyIntensity || 0
    );
    
    if (filters.performance !== 'all') {
      const isAboveTarget = performance >= 80;
      if (filters.performance === 'above' && !isAboveTarget) return false;
      if (filters.performance === 'below' && isAboveTarget) return false;
    }
    if (filters.team !== 'all' && user.team.toLowerCase() !== filters.team.toLowerCase()) {
      return false;
    }
    if (filters.dateRange !== 'all') {
      const lastMessageDate = getLastMessageDate(user.id);
      if (!lastMessageDate) return false;
      
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastMessageDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filters.dateRange) {
        case 'today':
          if (diffDays > 1) return false;
          break;
        case 'week':
          if (diffDays > 7) return false;
          break;
        case 'month':
          if (diffDays > 30) return false;
          break;
      }
    }
    return true;
  });

  // Sort users by performance score
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aOverview = getOverviewById(a.id);
    const bOverview = getOverviewById(b.id);
    const aPerformance = calculateUserPerformance(
      aOverview.engagementLevel,
      aOverview.progressLevel,
      aOverview.weeklyIntensity || 0
    );
    const bPerformance = calculateUserPerformance(
      bOverview.engagementLevel,
      bOverview.progressLevel,
      bOverview.weeklyIntensity || 0
    );
    return bPerformance - aPerformance;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 0) {
      return (
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 flex items-center justify-center bg-yellow-600 rounded-xl shadow-md transform group-hover:scale-110 transition-all duration-300 border-2 border-yellow-400/50">
            <Crown className="h-7 w-7 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
      );
    }
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-500 rounded-xl shadow-md transform group-hover:scale-110 transition-all duration-300 border-2 border-gray-300/50">
            <Medal className="h-7 w-7 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 flex items-center justify-center bg-amber-700 rounded-xl shadow-md transform group-hover:scale-110 transition-all duration-300 border-2 border-amber-500/50">
            <Award className="h-7 w-7 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-12 h-12 flex items-center justify-center bg-purple-900 rounded-xl shadow-md text-2xl font-bold text-white transform group-hover:scale-110 transition-all duration-300 border-2 border-purple-600/50">
        #{rank + 1}
      </div>
    );
  };

  const getPerformanceBadge = (performance: number) => {
    let colors = '';
    let title = '';
    
    if (performance >= 90) {
      colors = 'bg-green-700 border-green-600';
      title = 'מצוין';
    } else if (performance >= 80) {
      colors = 'bg-teal-700 border-teal-600';
      title = 'טוב מאוד';
    } else if (performance >= 70) {
      colors = 'bg-blue-700 border-blue-600';
      title = 'טוב';
    } else if (performance >= 60) {
      colors = 'bg-yellow-700 border-yellow-600';
      title = 'סביר';
    } else {
      colors = 'bg-red-700 border-red-600';
      title = 'טעון שיפור';
    }
    
    return (
      <div className={`px-3 py-1 ${colors} text-white font-medium rounded-xl shadow-sm border`}>
        {title}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-purple-600/50 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1" dir="rtl">
      {sortedUsers.length === 0 ? (
        <div className="p-12 text-center">
          <div className="p-6 bg-purple-900 rounded-full mx-auto w-24 h-24 flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-200 mb-2">אין מתאמנים תואמים</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            נסה לשנות את הסינון כדי לראות תוצאות
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-900 border-b border-purple-700">
                <th className="py-4 px-6 text-white font-bold text-right">דירוג</th>
                <th className="py-4 px-6 text-white font-bold text-right">מתאמן</th>
                <th className="py-4 px-6 text-white font-bold text-right">סטטוס</th>
                <th className="py-4 px-6 text-white font-bold text-right">רמה</th>
                <th className="py-4 px-6 text-white font-bold text-right">ניקוד</th>
                <th className="py-4 px-6 text-white font-bold text-right">פעילות אחרונה</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {sortedUsers.map((user, index) => {
                const userOverview = getOverviewById(user.id);
                const performance = calculateUserPerformance(
                  userOverview.engagementLevel,
                  userOverview.progressLevel,
                  userOverview.weeklyIntensity || 0
                );
                const lastMessageDate = getLastMessageDate(user.id);
                const lastActive = lastMessageDate ? formatDate(lastMessageDate) : 'אף פעם';

                return (
                  <tr 
                    key={user.id} 
                    onClick={() => onUserSelect(user.id)}
                    className={`hover:bg-purple-900/10 cursor-pointer transition-all duration-200 group ${
                      index < 3 ? 'bg-gray-900' : 'bg-gray-800'
                    }`}
                  >
                    <td className="py-4 px-6">
                      {getRankBadge(index)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            className="h-12 w-12 rounded-xl object-cover border-2 border-gray-700 group-hover:border-purple-500 transition-all duration-200 shadow-md" 
                            src={user.avatar} 
                            alt="" 
                          />
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-purple-300 transition-colors duration-200 flex items-center">
                            {user.name}
                            <ChevronLeft className="h-4 w-4 opacity-0 group-hover:opacity-100 ml-1 transform group-hover:translate-x-1 transition-all duration-200" />
                          </div>
                          <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="py-2 px-4 bg-purple-900 text-center font-medium text-white rounded-xl shadow-sm border border-purple-700 group-hover:border-purple-500/50 transition-all duration-300">
                        {user.team === 'beginner' ? 'מתחיל' :
                         user.team === 'intermediate' ? 'מתקדם' :
                         user.team === 'advanced' ? 'מקצועי' :
                         user.team}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {getPerformanceBadge(performance)}
                        <div className="w-12 h-12 rounded-xl bg-purple-900 border border-purple-700 shadow-inner flex items-center justify-center font-bold text-2xl text-white group-hover:border-purple-500/50 transition-all duration-300 transform group-hover:scale-110">
                          {performance}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-white bg-purple-900 py-2 px-4 rounded-xl inline-block shadow-sm border border-purple-700 group-hover:border-purple-500/50 transition-all duration-300">
                        {lastActive}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export { UserTable };