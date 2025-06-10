import React from 'react';
import { Users, Activity, TrendingUp, Award, UserPlus, AlertTriangle, Target, Clock, MessageSquare, CheckCircle, Edit2, MessageCircle, Clipboard, Heart, Zap, Briefcase } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { calculateMasterKPIs } from '../../utils/adminKPICalculations';

export const AdminDashboard: React.FC = () => {
  const { users, trainers, workoutLogs } = useAdmin();
  const kpis = calculateMasterKPIs(users, trainers, workoutLogs);

  return (
    <div className="space-y-6">
      {/* Master KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-l-8 border-purple-600 transform hover:scale-102 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-900 to-purple-800 shadow-inner">
              <Briefcase className="h-6 w-6 text-purple-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200">Trainer Productivity</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 text-transparent bg-clip-text">{kpis.trainerProductivityScore}/100</p>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full ${
                kpis.trainerProductivityScore >= 85 
                  ? 'bg-gradient-to-r from-green-500 to-green-400' 
                  : kpis.trainerProductivityScore >= 75
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                  : 'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${kpis.trainerProductivityScore}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm mt-3">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              kpis.trainerProductivityScore >= 85 
                ? 'bg-green-900 text-green-200' 
                : kpis.trainerProductivityScore >= 75
                ? 'bg-yellow-900 text-yellow-200'
                : 'bg-red-900 text-red-200'
            }`}>
              Target: 85
            </div>
            <div className="flex items-center gap-1 ml-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-green-400">+3% vs last week</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-l-8 border-blue-600 transform hover:scale-102 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900 to-blue-800 shadow-inner">
              <Heart className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200">Client Success</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 text-transparent bg-clip-text">{kpis.clientSuccessScore}/100</p>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full ${
                kpis.clientSuccessScore >= 80 
                  ? 'bg-gradient-to-r from-green-500 to-green-400' 
                  : kpis.clientSuccessScore >= 70
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                  : 'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${kpis.clientSuccessScore}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm mt-3">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              kpis.clientSuccessScore >= 80 
                ? 'bg-green-900 text-green-200' 
                : kpis.clientSuccessScore >= 70
                ? 'bg-yellow-900 text-yellow-200'
                : 'bg-red-900 text-red-200'
            }`}>
              Target: 80
            </div>
            <div className="flex items-center gap-1 ml-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-green-400">+5% vs last week</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-l-8 border-green-600 transform hover:scale-102 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-900 to-green-800 shadow-inner">
              <Zap className="h-6 w-6 text-green-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200">Platform Engagement</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-300 text-transparent bg-clip-text">{kpis.platformEngagementScore}/100</p>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full ${
                kpis.platformEngagementScore >= 80 
                  ? 'bg-gradient-to-r from-green-500 to-green-400' 
                  : kpis.platformEngagementScore >= 70
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                  : 'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${kpis.platformEngagementScore}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm mt-3">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              kpis.platformEngagementScore >= 80 
                ? 'bg-green-900 text-green-200' 
                : kpis.platformEngagementScore >= 70
                ? 'bg-yellow-900 text-yellow-200'
                : 'bg-red-900 text-red-200'
            }`}>
              Target: 80
            </div>
            <div className="flex items-center gap-1 ml-2">
              <TrendingUp className="h-4 w-4 text-red-400" />
              <span className="text-red-400">-2% vs last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trainer KPIs */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-purple-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-800 to-purple-700">
            <Briefcase className="h-6 w-6 text-purple-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-200">Trainer KPIs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <h4 className="font-medium text-gray-200">Avg Response Time</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.trainerMetrics.avgResponseTime}h</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.trainerMetrics.avgResponseTime <= 12 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.trainerMetrics.avgResponseTime <= 12 ? 'Target: <12h' : 'Above target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full rounded-full ${
                  kpis.trainerMetrics.avgResponseTime <= 12 
                    ? 'bg-gradient-to-r from-green-500 to-green-400' 
                    : 'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                style={{ width: `${Math.max(0, 100 - ((kpis.trainerMetrics.avgResponseTime / 24) * 100))}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <MessageSquare className="h-5 w-5 text-blue-400" />
              </div>
              <h4 className="font-medium text-gray-200">Messages Per Client</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.trainerMetrics.messagesPerClient}/week</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.trainerMetrics.messagesPerClient >= 2 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.trainerMetrics.messagesPerClient >= 2 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                style={{ width: `${Math.min(100, (kpis.trainerMetrics.messagesPerClient / 4) * 100)}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <Edit2 className="h-5 w-5 text-amber-400" />
              </div>
              <h4 className="font-medium text-gray-200">Plan Customizations</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.trainerMetrics.planCustomizationsMonthly}/month</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.trainerMetrics.planCustomizationsMonthly >= 1 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.trainerMetrics.planCustomizationsMonthly >= 1 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                style={{ width: `${Math.min(100, (kpis.trainerMetrics.planCustomizationsMonthly / 2) * 100)}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <MessageCircle className="h-5 w-5 text-indigo-400" />
              </div>
              <h4 className="font-medium text-gray-200">Chatbot Override Rate</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.trainerMetrics.chatbotOverrideRate}%</p>
              <span className={`text-sm px-2 py-1 rounded-full ${
                kpis.trainerMetrics.chatbotOverrideRate >= 10 && kpis.trainerMetrics.chatbotOverrideRate <= 25 
                  ? 'bg-green-800 text-green-200' 
                  : 'bg-yellow-800 text-yellow-200'
              }`}>
                {kpis.trainerMetrics.chatbotOverrideRate >= 10 && kpis.trainerMetrics.chatbotOverrideRate <= 25 
                  ? 'Optimal' 
                  : kpis.trainerMetrics.chatbotOverrideRate < 10 
                    ? 'Low engagement'
                    : 'High override'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full rounded-full ${
                  kpis.trainerMetrics.chatbotOverrideRate >= 10 && kpis.trainerMetrics.chatbotOverrideRate <= 25
                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                }`}
                style={{ width: `${Math.min(100, (kpis.trainerMetrics.chatbotOverrideRate / 40) * 100)}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <Clipboard className="h-5 w-5 text-teal-400" />
              </div>
              <h4 className="font-medium text-gray-200">Clients with Updated Notes</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.trainerMetrics.clientsWithUpdatedNotes}%</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.trainerMetrics.clientsWithUpdatedNotes >= 80 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.trainerMetrics.clientsWithUpdatedNotes >= 80 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
                style={{ width: `${kpis.trainerMetrics.clientsWithUpdatedNotes}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <h4 className="font-medium text-gray-200">Client Status Review Rate</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.trainerMetrics.clientStatusReviewRate}%</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.trainerMetrics.clientStatusReviewRate >= 90 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.trainerMetrics.clientStatusReviewRate >= 90 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                style={{ width: `${kpis.trainerMetrics.clientStatusReviewRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Client KPIs */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-blue-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-800 to-blue-700">
            <Heart className="h-6 w-6 text-blue-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-200">Client KPIs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <h4 className="font-medium text-gray-200">Workout Adherence</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.clientMetrics.workoutAdherenceRate}%</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.clientMetrics.workoutAdherenceRate >= 85 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.clientMetrics.workoutAdherenceRate >= 85 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                style={{ width: `${kpis.clientMetrics.workoutAdherenceRate}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <Clipboard className="h-5 w-5 text-teal-400" />
              </div>
              <h4 className="font-medium text-gray-200">Meal Plan Adherence</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.clientMetrics.mealPlanAdherenceRate}%</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.clientMetrics.mealPlanAdherenceRate >= 80 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.clientMetrics.mealPlanAdherenceRate >= 80 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
                style={{ width: `${kpis.clientMetrics.mealPlanAdherenceRate}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <CheckCircle className="h-5 w-5 text-indigo-400" />
              </div>
              <h4 className="font-medium text-gray-200">Check-In Completion</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.clientMetrics.checkInCompletionRate}%</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.clientMetrics.checkInCompletionRate >= 75 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.clientMetrics.checkInCompletionRate >= 75 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                style={{ width: `${kpis.clientMetrics.checkInCompletionRate}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <Target className="h-5 w-5 text-amber-400" />
              </div>
              <h4 className="font-medium text-gray-200">Program Progress</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.clientMetrics.programProgressScore}%</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.clientMetrics.programProgressScore >= 70 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.clientMetrics.programProgressScore >= 70 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                style={{ width: `${kpis.clientMetrics.programProgressScore}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <MessageCircle className="h-5 w-5 text-violet-400" />
              </div>
              <h4 className="font-medium text-gray-200">AI Chatbot Interaction</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.clientMetrics.aiChatbotInteractionRate}x/week</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.clientMetrics.aiChatbotInteractionRate >= 3 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.clientMetrics.aiChatbotInteractionRate >= 3 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400"
                style={{ width: `${(kpis.clientMetrics.aiChatbotInteractionRate / 7) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <Award className="h-5 w-5 text-pink-400" />
              </div>
              <h4 className="font-medium text-gray-200">Client Satisfaction</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.clientMetrics.clientSatisfactionScore}/10</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.clientMetrics.clientSatisfactionScore >= 8 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.clientMetrics.clientSatisfactionScore >= 8 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-pink-400"
                style={{ width: `${(kpis.clientMetrics.clientSatisfactionScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Platform Engagement KPIs */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-green-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-800 to-green-700">
            <Zap className="h-6 w-6 text-green-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-200">Platform Engagement</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <Users className="h-5 w-5 text-green-400" />
              </div>
              <h4 className="font-medium text-gray-200">Weekly Active Users</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.platformMetrics.weeklyActiveUserRate}%</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.platformMetrics.weeklyActiveUserRate >= 60 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.platformMetrics.weeklyActiveUserRate >= 60 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
                style={{ width: `${kpis.platformMetrics.weeklyActiveUserRate}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <Clock className="h-5 w-5 text-teal-400" />
              </div>
              <h4 className="font-medium text-gray-200">Avg Session Duration</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.platformMetrics.avgSessionDuration} min</p>
              <span className={`text-sm px-2 py-1 rounded-full ${
                kpis.platformMetrics.avgSessionDuration >= 3 && kpis.platformMetrics.avgSessionDuration <= 6 
                  ? 'bg-green-800 text-green-200' 
                  : 'bg-yellow-800 text-yellow-200'
              }`}>
                {kpis.platformMetrics.avgSessionDuration >= 3 && kpis.platformMetrics.avgSessionDuration <= 6 
                  ? 'Optimal' 
                  : kpis.platformMetrics.avgSessionDuration < 3 
                    ? 'Too short' 
                    : 'Too long'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full rounded-full ${
                  kpis.platformMetrics.avgSessionDuration >= 3 && kpis.platformMetrics.avgSessionDuration <= 6
                    ? 'bg-gradient-to-r from-teal-500 to-teal-400'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                }`}
                style={{ width: `${(kpis.platformMetrics.avgSessionDuration / 10) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <Activity className="h-5 w-5 text-cyan-400" />
              </div>
              <h4 className="font-medium text-gray-200">Session Frequency</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.platformMetrics.sessionFrequency}x/week</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.platformMetrics.sessionFrequency >= 4 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.platformMetrics.sessionFrequency >= 4 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                style={{ width: `${(kpis.platformMetrics.sessionFrequency / 7) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-gray-600 transform hover:scale-102 transition-all duration-300 hover:border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gray-900/80">
                <Target className="h-5 w-5 text-emerald-400" />
              </div>
              <h4 className="font-medium text-gray-200">Actions per Session</h4>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{kpis.platformMetrics.actionsPerSession}</p>
              <span className={`text-sm px-2 py-1 rounded-full ${kpis.platformMetrics.actionsPerSession >= 3 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {kpis.platformMetrics.actionsPerSession >= 3 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                style={{ width: `${(kpis.platformMetrics.actionsPerSession / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};