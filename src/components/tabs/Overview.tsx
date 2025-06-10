import React, { useState } from 'react';
import { events } from '../../data/events';
import { calculateTimeLeft } from '../../utils/dateUtils';
import { calculateWeeklyIntensity } from '../../utils/workoutUtils';
import { workoutLogs } from '../../data/workoutLogs';
import {
  Scale,
  Heart,
  Award,
  Clock,
  Calendar,
  AlertCircle,
  Trophy,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  User,
  Edit
} from 'lucide-react';
import { users } from '../../data/users';
import { calculateUserPerformance } from '../../utils/userPerformance';
import { getOverviewById } from '../../data/overview';
import { UserScopes } from '../user/UserScopes';
import { ProgressLeaderboard } from '../user/ProgressLeaderboard';
import { ClientAdjustmentButton, AdjustmentHistoryButton } from '../trainer/ClientAdjustmentButton';
import { useWorkoutLog } from '../../contexts/WorkoutLogContext';

interface OverviewProps {
  engagementRate: number;
  userOverview: any;
  isTrainerView?: boolean;
}

export const Overview: React.FC<OverviewProps> = ({ engagementRate, userOverview, isTrainerView = false }) => {
  const { getWorkoutLogs } = useWorkoutLog();
  const userWorkoutLogs = getWorkoutLogs(userOverview.userId);
  const weeklyIntensity = calculateWeeklyIntensity(userWorkoutLogs);
  const timeLeft = calculateTimeLeft(userOverview.membershipEndDate);

  // Calculate user's rank in leaderboard
  const sortedUsers = [...users].sort((a, b) => {
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

  const userRank = sortedUsers.findIndex(u => u.id === userOverview.userId) + 1;
  const userPerformance = calculateUserPerformance(
    userOverview.engagementLevel,
    userOverview.progressLevel,
    userOverview.weeklyIntensity || 0
  );

  // Calculate weight change percentage
  const weightChange = userOverview.currentWeight - userOverview.startingWeight;
  const weightChangePercent = Math.abs(Math.round((weightChange / userOverview.startingWeight) * 100));
  
  // Calculate fat percentage change
  const fatChange = userOverview.currentFatPercentage - userOverview.startingFatPercentage;

  return (
    <div className="max-w-5xl mx-auto space-y-6" dir="rtl">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-purple-700">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-6 border-b border-gray-700">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
            <div className="relative mb-3 sm:mb-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-70 blur"></div>
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center border-4 border-purple-300/30 relative">
                <span className="text-3xl font-bold text-white">{userOverview.userName.charAt(0)}</span>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-white text-transparent bg-clip-text mb-2">{userOverview.userName}</h2>
              <div className="bg-gradient-to-br from-purple-900/60 to-purple-800/60 px-4 py-1.5 rounded-full border border-purple-700 inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-200">{timeLeft}</span>
              </div>
            </div>
          </div>
          
          {/* Trainer actions */}
          {isTrainerView && (
            <div className="flex flex-col sm:flex-row mt-4 sm:mt-0 gap-3">
              <ClientAdjustmentButton 
                userId={userOverview.userId}
                userName={userOverview.userName}
              />
              
              <AdjustmentHistoryButton
                userId={userOverview.userId}
                hasHistory={false}
              />
            </div>
          )}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Weight Card */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 border-2 border-purple-700/50 hover:border-purple-600 transition-all duration-200 text-center shadow-md transform hover:scale-102">
            <div className="flex justify-center items-center mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-900 to-purple-800 flex items-center justify-center shadow-inner border border-purple-700">
                <Scale className="h-6 w-6 text-purple-300" />
              </div>
            </div>
            <h4 className="font-bold text-gray-200 mb-1">משקל</h4>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-white text-transparent bg-clip-text">{userOverview.currentWeight} <span className="text-sm text-purple-300">ק"ג</span></div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {weightChange < 0 ? (
                <div className="bg-green-900/70 text-green-300 px-2 py-1 rounded-full text-sm font-medium flex items-center border border-green-700/50 shadow-inner">
                  <ArrowDownRight className="h-3 w-3 mr-1" /> 
                  <span>ירד {Math.abs(weightChange)}</span>
                </div>
              ) : weightChange > 0 ? (
                <div className="bg-red-900/70 text-red-300 px-2 py-1 rounded-full text-sm font-medium flex items-center border border-red-700/50 shadow-inner">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> 
                  <span>עלה {weightChange}</span>
                </div>
              ) : (
                <div className="bg-gray-800/70 text-gray-300 px-2 py-1 rounded-full text-sm font-medium border border-gray-700/50 shadow-inner">
                  <Minus className="h-3 w-3 mr-1 inline" /> ללא שינוי
                </div>
              )}
            </div>
          </div>

          {/* Body Fat Card */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 border-2 border-blue-700/50 hover:border-blue-600 transition-all duration-200 text-center shadow-md transform hover:scale-102">
            <div className="flex justify-center items-center mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center shadow-inner border border-blue-700">
                <Heart className="h-6 w-6 text-blue-300" />
              </div>
            </div>
            <h4 className="font-bold text-gray-200 mb-1">שומן גוף</h4>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-white text-transparent bg-clip-text">{userOverview.currentFatPercentage}<span className="text-sm text-blue-300">%</span></div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {fatChange < 0 ? (
                <div className="bg-green-900/70 text-green-300 px-2 py-1 rounded-full text-sm font-medium flex items-center border border-green-700/50 shadow-inner">
                  <ArrowDownRight className="h-3 w-3 mr-1" /> 
                  <span>ירד {Math.abs(fatChange)}%</span>
                </div>
              ) : fatChange > 0 ? (
                <div className="bg-red-900/70 text-red-300 px-2 py-1 rounded-full text-sm font-medium flex items-center border border-red-700/50 shadow-inner">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> 
                  <span>עלה {fatChange}%</span>
                </div>
              ) : (
                <div className="bg-gray-800/70 text-gray-300 px-2 py-1 rounded-full text-sm font-medium border border-gray-700/50 shadow-inner">
                  <Minus className="h-3 w-3 mr-1 inline" /> ללא שינוי
                </div>
              )}
            </div>
          </div>

          {/* Score Card */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 border-2 border-amber-700/50 hover:border-amber-600 transition-all duration-200 text-center shadow-md transform hover:scale-102">
            <div className="flex justify-center items-center mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-900 to-amber-800 flex items-center justify-center shadow-inner border border-amber-700">
                <Award className="h-6 w-6 text-amber-300" />
              </div>
            </div>
            <h4 className="font-bold text-gray-200 mb-1">ציון</h4>
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-white text-transparent bg-clip-text">{userPerformance}</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {userPerformance >= 85 ? (
                <div className="bg-green-900/70 text-green-300 px-2 py-1 rounded-full text-sm font-medium border border-green-700/50 shadow-inner">
                  🔥 מצוין!
                </div>
              ) : userPerformance >= 70 ? (
                <div className="bg-blue-900/70 text-blue-300 px-2 py-1 rounded-full text-sm font-medium border border-blue-700/50 shadow-inner">
                  👍 טוב
                </div>
              ) : (
                <div className="bg-yellow-900/70 text-yellow-300 px-2 py-1 rounded-full text-sm font-medium border border-yellow-700/50 shadow-inner">
                  💪 בדרך
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Progress Leaderboard Component */}
        <ProgressLeaderboard 
          userId={userOverview.userId}
          goal={userOverview.goal}
          currentWeight={userOverview.currentWeight}
          previousWeight={userOverview.currentWeight + (userOverview.goal === 'muscle_gain' ? -1.5 : 2)}
          currentFatPercentage={userOverview.currentFatPercentage}
          previousFatPercentage={userOverview.currentFatPercentage + (userOverview.goal === 'fat_loss' ? 2 : -0.5)}
          isTrainerView={isTrainerView}
        />

        {/* Body Measurements */}
        <UserScopes userId={userOverview.userId} isTrainer={isTrainerView} />

        {/* Activity & Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Updates */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4 bg-gradient-to-r from-purple-400 to-white text-transparent bg-clip-text">עדכונים אחרונים</h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border-2 border-purple-700/50 hover:border-purple-600 transition-all duration-200 shadow-md transform hover:scale-102">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-900 to-purple-800">
                    <Trophy className="h-5 w-5 text-purple-300" />
                  </div>
                  <h4 className="font-medium text-gray-200">הישג אחרון</h4>
                </div>
                <p className="text-gray-300">{userOverview.latestChanges}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border-2 border-blue-700/50 hover:border-blue-600 transition-all duration-200 shadow-md transform hover:scale-102">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-900 to-blue-800">
                    <Clock className="h-5 w-5 text-blue-300" />
                  </div>
                  <h4 className="font-medium text-gray-200">פעילות אחרונה</h4>
                </div>
                <p className="text-gray-300">{userOverview.latestEvents}</p>
              </div>
            </div>
          </div>

          {/* Events */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4 bg-gradient-to-r from-purple-400 to-white text-transparent bg-clip-text">אירועים קרובים</h3>
            <div className="space-y-3">
              {events.slice(0, 3).map((event, idx) => (
                <div key={idx} className={`rounded-lg p-4 border-2 shadow-md transform hover:scale-102 transition-all duration-200 ${
                  event.type === 'social_event'
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-emerald-700/50 hover:border-emerald-600'
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 border-amber-700/50 hover:border-amber-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {event.type === 'social_event' ? (
                      <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-900 to-emerald-800">
                        <Calendar className="h-4 w-4 text-emerald-300" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-900 to-amber-800">
                        <AlertCircle className="h-4 w-4 text-amber-300" />
                      </div>
                    )}
                    <span className="font-medium text-gray-200">{event.date}</span>
                    <span className={`text-sm px-2 py-0.5 rounded-full shadow-inner ${
                      event.type === 'social_event'
                        ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/50'
                        : 'bg-amber-900/80 text-amber-300 border border-amber-700/50'
                    }`}>
                      {event.type === 'social_event' ? 'חברתי' : 'בריאות'}
                    </span>
                  </div>
                  <p className="text-gray-300">{event.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};