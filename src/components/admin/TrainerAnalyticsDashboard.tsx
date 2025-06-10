import React from 'react';
import { ChevronLeft, Users, Target, Clock, Award, TrendingUp, MessageSquare, Calendar, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { calculateTrainerAnalytics } from '../../utils/trainerAnalytics';
import { getTrainerById } from '../../data/trainers';

interface TrainerAnalyticsDashboardProps {
  trainerId: string;
  onBack: () => void;
}

export const TrainerAnalyticsDashboard: React.FC<TrainerAnalyticsDashboardProps> = ({ trainerId, onBack }) => {
  const { users, workoutLogs } = useAdmin();
  const trainer = getTrainerById(trainerId);
  
  if (!trainer) {
    return <div>Trainer not found</div>;
  }

  const analytics = calculateTrainerAnalytics(trainer, users, workoutLogs);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border-2 border-purple-700">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="h-6 w-6 text-purple-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-white text-transparent bg-clip-text">{trainer.name}</h1>
            <p className="text-gray-400">
              {trainer.role === 'senior_trainer' ? 'Senior Trainer' :
               trainer.role === 'junior_trainer' ? 'Junior Trainer' :
               'Nutrition Specialist'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-md ${
            trainer.status === 'active' ? 'bg-gradient-to-r from-green-700 to-green-600 text-green-200 border border-green-600' :
            trainer.status === 'inactive' ? 'bg-gradient-to-r from-red-700 to-red-600 text-red-200 border border-red-600' :
            'bg-gradient-to-r from-yellow-700 to-yellow-600 text-yellow-200 border border-yellow-600'
          }`}>
            {trainer.status.charAt(0).toUpperCase() + trainer.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-purple-600 transform hover:scale-102 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg shadow-md">
              <Users className="h-5 w-5 text-purple-300" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Active Clients</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 text-transparent bg-clip-text">
              {analytics.activeClients}
              <span className="text-lg text-gray-500 ml-1">/ {analytics.totalClients}</span>
            </div>
            <div className="mt-3 flex items-center">
              <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-full" 
                  style={{ width: `${(analytics.activeClients / analytics.totalClients) * 100}%` }}
                />
              </div>
              <span className="ml-2 text-xs font-medium text-gray-400">
                {Math.round((analytics.activeClients / analytics.totalClients) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-blue-600 transform hover:scale-102 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg shadow-md">
              <Target className="h-5 w-5 text-blue-300" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Client Progress</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 text-transparent bg-clip-text">
              {Math.round(analytics.avgClientProgress)}%
            </div>
            <div className="mt-3 flex items-center">
              <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" 
                  style={{ width: `${Math.round(analytics.avgClientProgress)}%` }}
                />
              </div>
              <span className="ml-2 text-xs font-medium text-gray-400">
                Target: 80%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-green-600 transform hover:scale-102 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-green-900 to-green-800 rounded-lg shadow-md">
              <Clock className="h-5 w-5 text-green-300" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Client Retention</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-300 text-transparent bg-clip-text">
              {Math.round(analytics.clientRetention)}%
            </div>
            <div className="mt-3 flex items-center">
              <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full" 
                  style={{ width: `${Math.round(analytics.clientRetention)}%` }}
                />
              </div>
              <span className="ml-2 text-xs font-medium text-gray-400">
                Target: 90%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-amber-600 transform hover:scale-102 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-amber-900 to-amber-800 rounded-lg shadow-md">
              <Award className="h-5 w-5 text-amber-300" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Goals Achieved</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 text-transparent bg-clip-text">
              {analytics.weeklyMetrics.goalsAchieved}
              <span className="text-lg text-gray-500 ml-1">/ wk</span>
            </div>
            <div className="mt-3 px-3 py-1.5 bg-gradient-to-r from-amber-900/30 to-amber-800/30 rounded-lg border border-amber-700/30 text-xs text-amber-300 flex items-center justify-center gap-2">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+{Math.floor(Math.random() * 3) + 1} from previous week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border-2 border-purple-700/50 hover:border-purple-700 transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 bg-gradient-to-r from-purple-400 to-white text-transparent bg-clip-text">Weekly Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-900/30 to-green-800/30 rounded-lg border border-green-700/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-900/70 rounded-lg shadow-inner">
                  <Users className="h-4 w-4 text-green-300" />
                </div>
                <span className="font-medium text-green-200">Active Clients</span>
              </div>
              <span className="text-lg font-semibold text-green-200 bg-green-900/60 px-3 py-1 rounded-lg shadow-inner">
                {analytics.activeClients}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-lg border border-blue-700/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900/70 rounded-lg shadow-inner">
                  <CheckCircle className="h-4 w-4 text-blue-300" />
                </div>
                <span className="font-medium text-blue-200">Completed Sessions</span>
              </div>
              <span className="text-lg font-semibold text-blue-200 bg-blue-900/60 px-3 py-1 rounded-lg shadow-inner">
                {analytics.weeklyMetrics.completedSessions}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-900/30 to-red-800/30 rounded-lg border border-red-700/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-900/70 rounded-lg shadow-inner">
                  <XCircle className="h-4 w-4 text-red-300" />
                </div>
                <span className="font-medium text-red-200">Missed Sessions</span>
              </div>
              <span className="text-lg font-semibold text-red-200 bg-red-900/60 px-3 py-1 rounded-lg shadow-inner">
                {analytics.weeklyMetrics.missedSessions}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-lg border border-purple-700/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-900/70 rounded-lg shadow-inner">
                  <Target className="h-4 w-4 text-purple-300" />
                </div>
                <span className="font-medium text-purple-200">Goals Achieved</span>
              </div>
              <span className="text-lg font-semibold text-purple-200 bg-purple-900/60 px-3 py-1 rounded-lg shadow-inner">
                {analytics.weeklyMetrics.goalsAchieved}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border-2 border-blue-700/50 hover:border-blue-700 transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 bg-gradient-to-r from-blue-400 to-white text-transparent bg-clip-text">Client Progress Overview</h3>
          <div className="space-y-4">
            {analytics.clientProgress.map((client, index) => (
              <div key={index} className="relative overflow-hidden">
                <div className={`absolute inset-0 opacity-10 ${
                  client.status === 'ahead' ? 'bg-gradient-to-r from-green-900 to-transparent' :
                  client.status === 'on_track' ? 'bg-gradient-to-r from-blue-900 to-transparent' :
                  'bg-gradient-to-r from-yellow-900 to-transparent'
                }`}></div>
                
                <div className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 p-4 rounded-lg border border-gray-600/50 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg shadow-md ${
                        client.status === 'ahead' ? 'bg-gradient-to-br from-green-800 to-green-900' :
                        client.status === 'on_track' ? 'bg-gradient-to-br from-blue-800 to-blue-900' :
                        'bg-gradient-to-br from-yellow-800 to-yellow-900'
                      }`}>
                        {client.status === 'ahead' ? (
                          <TrendingUp className="h-4 w-4 text-green-300" />
                        ) : client.status === 'on_track' ? (
                          <Target className="h-4 w-4 text-blue-300" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-300" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">{client.name}</div>
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                          <Activity className="h-3.5 w-3.5" />
                          <span>{client.goal === 'fat_loss' ? 'Fat Loss' : 'Muscle Gain'}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-sm font-medium px-2.5 py-1 rounded-lg ${
                      client.status === 'ahead' ? 'bg-green-900/60 text-green-200 border border-green-700/50' :
                      client.status === 'on_track' ? 'bg-blue-900/60 text-blue-200 border border-blue-700/50' :
                      'bg-yellow-900/60 text-yellow-200 border border-yellow-700/50'
                    }`}>
                      {Math.round(client.progress)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full ${
                        client.status === 'ahead' ? 'bg-gradient-to-r from-green-600 to-green-500' :
                        client.status === 'on_track' ? 'bg-gradient-to-r from-blue-600 to-blue-500' :
                        'bg-gradient-to-r from-yellow-600 to-yellow-500'
                      }`}
                      style={{ width: `${client.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border-2 border-green-700/50 hover:border-green-700 transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-200 mb-4 bg-gradient-to-r from-green-400 to-white text-transparent bg-clip-text">Performance Trends</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 p-4 rounded-xl border border-gray-600/50">
            <h4 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-400" />
              Client Retention Rate
            </h4>
            <div className="h-40 flex items-end gap-2">
              {analytics.performanceMetrics.clientRetention.map((rate, index) => (
                <div
                  key={index}
                  className="relative flex-1 rounded-t-lg overflow-hidden group"
                  style={{ height: `${rate}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-600 to-purple-700 opacity-80 group-hover:from-purple-500 group-hover:to-purple-600 transition-colors duration-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xs font-medium text-white transform -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {Math.round(rate)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 p-4 rounded-xl border border-gray-600/50">
            <h4 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-green-400" />
              Client Progress Rate
            </h4>
            <div className="h-40 flex items-end gap-2">
              {analytics.performanceMetrics.clientProgress.map((rate, index) => (
                <div
                  key={index}
                  className="relative flex-1 rounded-t-lg overflow-hidden group"
                  style={{ height: `${rate}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-green-600 to-green-700 opacity-80 group-hover:from-green-500 group-hover:to-green-600 transition-colors duration-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xs font-medium text-white transform -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {Math.round(rate)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};