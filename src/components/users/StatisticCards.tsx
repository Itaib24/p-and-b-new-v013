import React from 'react';
import { User } from '../../types/user';
import { Users, Target, AlertTriangle, TrendingUp, Trophy, Star, Award, Clock } from 'lucide-react';
import { getOverviewById } from '../../data/overview';
import { calculateUserPerformance } from '../../utils/userPerformance';
import { useWorkoutLog } from '../../contexts/WorkoutLogContext';

interface StatisticCardsProps {
  users: User[];
}

export const StatisticCards: React.FC<StatisticCardsProps> = ({ users }) => {
  const { getWorkoutLogs } = useWorkoutLog();
  
  const totalUsers = users.length;
  const usersNeedingAction = users.filter(u => u.status === 'attention').length;
  
  // Calculate users based on membership duration
  const usersLessThan6Months = users.filter(user => {
    const userOverview = getOverviewById(user.id);
    const startDate = new Date(userOverview.membershipStartDate);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return startDate >= sixMonthsAgo; // Joined less than 6 months ago
  }).length;
  
  const usersMoreThan6Months = users.filter(user => {
    const userOverview = getOverviewById(user.id);
    const startDate = new Date(userOverview.membershipStartDate);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return startDate < sixMonthsAgo; // Joined more than 6 months ago
  }).length;

  const averagePerformance = Math.round(
    users.reduce((sum, user) => {
      const userOverview = getOverviewById(user.id);
      const workoutLogs = getWorkoutLogs(user.id);
      const performance = calculateUserPerformance(
        workoutLogs,
        userOverview.startingWeight,
        userOverview.currentWeight,
        userOverview.startingFatPercentage,
        userOverview.currentFatPercentage,
        userOverview.goal
      );
      return sum + performance;
    }, 0) / (users.length || 1)
  ) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" dir="rtl">
      {/* Active Members Card */}
      <div className="bg-gray-800 rounded-xl p-5 shadow-md border-2 border-purple-600/50 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-purple-900 rounded-lg shadow-md">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{totalUsers}</div>
            <div className="text-purple-300 text-sm font-medium">מתאמנים פעילים</div>
          </div>
        </div>
        <div className="mt-3 bg-purple-900 p-2 rounded-lg flex items-center justify-center shadow-inner border border-purple-700/30">
          <Trophy className="h-4 w-4 text-purple-300 mr-1" />
          <span className="text-xs text-purple-200">סה״כ בקהילה</span>
        </div>
      </div>

      {/* Attention Needed Card */}
      <div className="bg-gray-800 rounded-xl p-5 shadow-md border-2 border-purple-600/50 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-red-900 rounded-lg shadow-md">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{usersNeedingAction}</div>
            <div className="text-red-300 text-sm font-medium">דורשים תשומת לב</div>
          </div>
        </div>
        <div className="mt-3 bg-red-900 p-2 rounded-lg flex items-center justify-center shadow-inner border border-red-700/30">
          <AlertTriangle className="h-4 w-4 text-red-300 mr-1" />
          <span className="text-xs text-red-200">מתאמנים לבדיקה</span>
        </div>
      </div>

      {/* New Members Card */}
      <div className="bg-gray-800 rounded-xl p-5 shadow-md border-2 border-purple-600/50 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-amber-900 rounded-lg shadow-md">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{usersLessThan6Months}</div>
            <div className="text-amber-300 text-sm font-medium">פחות מ-6 חודשים</div>
          </div>
        </div>
        <div className="mt-3 bg-amber-900 p-2 rounded-lg flex items-center justify-center shadow-inner border border-amber-700/30">
          <Star className="h-4 w-4 text-amber-300 mr-1" />
          <span className="text-xs text-amber-200">מתאמנים חדשים</span>
        </div>
      </div>

      {/* Veteran Members Card */}
      <div className="bg-gray-800 rounded-xl p-5 shadow-md border-2 border-purple-600/50 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-green-900 rounded-lg shadow-md">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{usersMoreThan6Months}</div>
            <div className="text-green-300 text-sm font-medium">יותר מ-6 חודשים</div>
          </div>
        </div>
        <div className="mt-3 bg-green-900 p-2 rounded-lg flex items-center justify-center shadow-inner border border-green-700/30">
          <Trophy className="h-4 w-4 text-green-300 mr-1" />
          <span className="text-xs text-green-200">מתאמנים ותיקים</span>
        </div>
      </div>
    </div>
  );
};