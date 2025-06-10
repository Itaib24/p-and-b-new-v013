import React, { useState } from 'react';
import { TrendingUp, Users, Activity, Award, AlertTriangle, Briefcase, Heart, Zap, Clock, MessageSquare, Edit2, CheckCircle, Filter, Calendar, Target, Clipboard, ArrowUp, ArrowDown } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { calculateMasterKPIs } from '../../utils/adminKPICalculations';

export const AdminAnalytics: React.FC = () => {
  const { users, trainers, workoutLogs } = useAdmin();
  const kpis = calculateMasterKPIs(users, trainers, workoutLogs);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'quarter'>('week');
  
  return (
    <div className="space-y-6">
      {/* Time Frame Selector */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-4 border-2 border-purple-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-900">
              <Calendar className="h-5 w-5 text-purple-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-200">Time Frame</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFrame('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeFrame === 'week' 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeFrame('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeFrame === 'month' 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeFrame('quarter')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeFrame === 'quarter' 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Quarter
            </button>
          </div>
        </div>
      </div>
      
      {/* Master KPIs Trend */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-purple-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-800 to-purple-700">
              <TrendingUp className="h-6 w-6 text-purple-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-200">Master KPIs Trend</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gray-700">
              <Filter className="h-5 w-5 text-gray-300" />
            </div>
            <select className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-sm text-gray-200 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">
              <option>All Metrics</option>
              <option>Trainer Productivity</option>
              <option>Client Success</option>
              <option>Platform Engagement</option>
            </select>
          </div>
        </div>
        
        {/* KPI Trend Chart Placeholder */}
        <div className="h-80 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-4 border border-gray-600 flex items-center justify-center relative overflow-hidden">
          {/* Decorative gradient background for the chart area */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/5 to-green-900/10"></div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-rows-4 grid-cols-6 gap-4">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="border-b border-r border-gray-700/40"></div>
            ))}
          </div>
          
          <div className="text-center z-10">
            <div className="bg-gray-800/80 rounded-full p-6 inline-block mb-4 border border-purple-700/40">
              <TrendingUp className="h-10 w-10 text-purple-400" />
            </div>
            <p className="text-gray-300 bg-gray-800/60 px-4 py-2 rounded-full border border-gray-700/40">The trend chart visualization would appear here</p>
          </div>
        </div>
        
        {/* Trend KPI Values */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border-l-4 border-purple-600 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-purple-900/80">
                  <Briefcase className="h-5 w-5 text-purple-300" />
                </div>
                <h3 className="font-medium text-gray-200">Trainer Productivity</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 text-transparent bg-clip-text">{kpis.trainerProductivityScore}</div>
                <div className="flex items-center gap-1 text-green-400">
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+3%</span>
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-full" 
                  style={{ width: `${kpis.trainerProductivityScore}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-purple-400 font-medium">Target: 85</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border-l-4 border-blue-600 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-blue-900/80">
                  <Heart className="h-5 w-5 text-blue-300" />
                </div>
                <h3 className="font-medium text-gray-200">Client Success</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 text-transparent bg-clip-text">{kpis.clientSuccessScore}</div>
                <div className="flex items-center gap-1 text-green-400">
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+5%</span>
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" 
                  style={{ width: `${kpis.clientSuccessScore}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-blue-400 font-medium">Target: 80</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border-l-4 border-green-600 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-green-900/80">
                  <Zap className="h-5 w-5 text-green-300" />
                </div>
                <h3 className="font-medium text-gray-200">Platform Engagement</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-300 text-transparent bg-clip-text">{kpis.platformEngagementScore}</div>
                <div className="flex items-center gap-1 text-red-400">
                  <ArrowDown className="h-4 w-4" />
                  <span className="text-sm font-medium">-2%</span>
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full" 
                  style={{ width: `${kpis.platformEngagementScore}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-green-400 font-medium">Target: 80</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Trainer KPI Breakdown */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-purple-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-800 to-purple-700">
            <Briefcase className="h-6 w-6 text-purple-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-200">Trainer KPI Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-purple-600/40 shadow-md hover:shadow-lg transition-all duration-300 hover:border-purple-600">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-400" />
              Response Time Distribution
            </h3>
            <div className="space-y-4">
              {kpis.trainerBreakdown.responseTimeDistribution.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 rounded-lg shadow-sm border border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-200">{item.trainer}</span>
                    <div className={`px-2 py-1 text-sm rounded-full ${
                      item.hours <= 12 ? 'bg-green-900/80 text-green-200' : 'bg-red-900/80 text-red-200'
                    } shadow-inner`}>
                      {item.hours}h
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full ${
                        item.hours <= 12 ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gradient-to-r from-red-600 to-red-500'
                      }`}
                      style={{ width: `${100 - (item.hours / 24 * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-blue-600/40 shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-600">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-blue-400" />
              Client Plan Customization Rate
            </h3>
            <div className="space-y-4">
              {kpis.trainerBreakdown.planCustomizationRate.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 rounded-lg shadow-sm border border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-200">{item.trainer}</span>
                    <div className={`px-2 py-1 text-sm rounded-full ${
                      item.rate >= 1 ? 'bg-green-900/80 text-green-200' : 'bg-red-900/80 text-red-200'
                    } shadow-inner`}>
                      {item.rate} per month
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full ${
                        item.rate >= 1 ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-red-600 to-red-500'
                      }`}
                      style={{ width: `${Math.min(item.rate * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Client Success Metrics */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-blue-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-800 to-blue-700">
            <Heart className="h-6 w-6 text-blue-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-200">Client Success Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-teal-600/40 shadow-md hover:shadow-lg transition-all duration-300 hover:border-teal-600">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-400" />
              Adherence Rates by Goal Type
            </h3>
            <div className="space-y-4">
              {kpis.clientBreakdown.adherenceByGoal.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 rounded-lg shadow-sm border border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-200">{item.goalType}</span>
                    <div className={`px-2 py-1 text-sm rounded-full ${
                      item.adherenceRate >= 80 ? 'bg-green-900/80 text-green-200' : 'bg-red-900/80 text-red-200'
                    } shadow-inner`}>
                      {item.adherenceRate}%
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full ${
                        item.adherenceRate >= 80 ? 'bg-gradient-to-r from-teal-600 to-teal-500' : 'bg-gradient-to-r from-red-600 to-red-500'
                      }`}
                      style={{ width: `${item.adherenceRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-indigo-600/40 shadow-md hover:shadow-lg transition-all duration-300 hover:border-indigo-600">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-400" />
              Client Progress Distribution
            </h3>
            <div className="space-y-4">
              {kpis.clientBreakdown.progressDistribution.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 rounded-lg shadow-sm border border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-200">{item.segment}</span>
                    <div className={`px-2 py-1 text-sm rounded-full ${
                      item.percentage >= 20 ? 'bg-green-900/80 text-green-200' : 'bg-yellow-900/80 text-yellow-200'
                    } shadow-inner`}>
                      {item.percentage}%
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Platform Engagement Details */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-green-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-800 to-green-700">
            <Zap className="h-6 w-6 text-green-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-200">Platform Engagement Details</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-cyan-600/40 shadow-md hover:shadow-lg transition-all duration-300 hover:border-cyan-600">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-400" />
              User Activity Timeline
            </h3>
            <div className="space-y-3">
              {kpis.platformBreakdown.userActivityTimeline.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-400 flex-shrink-0 font-medium">{activity.hour}</div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-full ${
                          activity.count === Math.max(...kpis.platformBreakdown.userActivityTimeline.map(a => a.count))
                            ? 'animate-pulse' : ''
                        }`}
                        style={{ width: `${(activity.count / Math.max(...kpis.platformBreakdown.userActivityTimeline.map(a => a.count)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <div className="text-sm font-medium text-white">{activity.count}</div>
                    <div className="text-xs text-gray-400">users</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-emerald-600/40 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-600">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-400" />
              Feature Usage Breakdown
            </h3>
            <div className="space-y-4">
              {kpis.platformBreakdown.featureUsage.map((feature, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 rounded-lg shadow-sm border border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {feature.name === 'Workout Logger' && 
                        <div className="p-2 rounded-lg bg-purple-900/60">
                          <Activity className="h-4 w-4 text-purple-300" />
                        </div>
                      }
                      {feature.name === 'Meal Tracker' && 
                        <div className="p-2 rounded-lg bg-blue-900/60">
                          <Clipboard className="h-4 w-4 text-blue-300" />
                        </div>
                      }
                      {feature.name === 'AI Chat' && 
                        <div className="p-2 rounded-lg bg-amber-900/60">
                          <MessageSquare className="h-4 w-4 text-amber-300" />
                        </div>
                      }
                      {feature.name === 'Progress Tracking' && 
                        <div className="p-2 rounded-lg bg-green-900/60">
                          <Target className="h-4 w-4 text-green-300" />
                        </div>
                      }
                      <span className="font-medium text-gray-200">{feature.name}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-300">{feature.usageRate}%</div>
                  </div>
                  <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full ${
                        feature.name === 'Workout Logger' ? 'bg-gradient-to-r from-purple-600 to-purple-500' :
                        feature.name === 'Meal Tracker' ? 'bg-gradient-to-r from-blue-600 to-blue-500' :
                        feature.name === 'AI Chat' ? 'bg-gradient-to-r from-amber-600 to-amber-500' :
                        'bg-gradient-to-r from-green-600 to-green-500'
                      }`}
                      style={{ width: `${feature.usageRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-purple-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-800 to-purple-700">
              <Award className="h-6 w-6 text-purple-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-200">Benchmark Comparison</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-purple-600/40 shadow-md hover:shadow-lg transition-all duration-300 hover:border-purple-600">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-purple-900/80">
                <Briefcase className="h-6 w-6 text-purple-300" />
              </div>
              <h3 className="font-medium text-gray-200">Trainer Benchmarking</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 p-3 rounded-lg border border-gray-700/50 hover:border-green-600/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-200">Top 10%</span>
                  <span className="text-sm bg-gradient-to-r from-green-900 to-green-800 text-green-200 px-2 py-1 rounded-full shadow-inner">≥90 score</span>
                </div>
                <div className="mt-2 text-sm text-gray-400 flex items-center">
                  <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner mr-2">
                    <div className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full" style={{ width: `${kpis.benchmarks.trainerTop10}%` }} />
                  </div>
                  {kpis.benchmarks.trainerTop10}% of trainers
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 p-3 rounded-lg border border-gray-700/50 hover:border-blue-600/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-200">Acceptable</span>
                  <span className="text-sm bg-gradient-to-r from-blue-900 to-blue-800 text-blue-200 px-2 py-1 rounded-full shadow-inner">75-89 score</span>
                </div>
                <div className="mt-2 text-sm text-gray-400 flex items-center">
                  <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner mr-2">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" style={{ width: `${kpis.benchmarks.trainerAcceptable}%` }} />
                  </div>
                  {kpis.benchmarks.trainerAcceptable}% of trainers
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 p-3 rounded-lg border border-gray-700/50 hover:border-red-600/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-200">At Risk</span>
                  <span className="text-sm bg-gradient-to-r from-red-900 to-red-800 text-red-200 px-2 py-1 rounded-full shadow-inner">&lt;75 score</span>
                </div>
                <div className="mt-2 text-sm text-gray-400 flex items-center">
                  <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner mr-2">
                    <div className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full" style={{ width: `${kpis.benchmarks.trainerAtRisk}%` }} />
                  </div>
                  {kpis.benchmarks.trainerAtRisk}% of trainers
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-blue-600/40 shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-600">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-900/80">
                <Heart className="h-6 w-6 text-blue-300" />
              </div>
              <h3 className="font-medium text-gray-200">Client Benchmarking</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 p-3 rounded-lg border border-gray-700/50 hover:border-green-600/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-200">Top 10%</span>
                  <span className="text-sm bg-gradient-to-r from-green-900 to-green-800 text-green-200 px-2 py-1 rounded-full shadow-inner">≥85 score</span>
                </div>
                <div className="mt-2 text-sm text-gray-400 flex items-center">
                  <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner mr-2">
                    <div className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full" style={{ width: `${kpis.benchmarks.clientTop10}%` }} />
                  </div>
                  {kpis.benchmarks.clientTop10}% of clients
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 p-3 rounded-lg border border-gray-700/50 hover:border-blue-600/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-200">Average</span>
                  <span className="text-sm bg-gradient-to-r from-blue-900 to-blue-800 text-blue-200 px-2 py-1 rounded-full shadow-inner">65-84 score</span>
                </div>
                <div className="mt-2 text-sm text-gray-400 flex items-center">
                  <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner mr-2">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" style={{ width: `${kpis.benchmarks.clientAverage}%` }} />
                  </div>
                  {kpis.benchmarks.clientAverage}% of clients
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 p-3 rounded-lg border border-gray-700/50 hover:border-red-600/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-200">Watchlist</span>
                  <span className="text-sm bg-gradient-to-r from-red-900 to-red-800 text-red-200 px-2 py-1 rounded-full shadow-inner">&lt;65 score</span>
                </div>
                <div className="mt-2 text-sm text-gray-400 flex items-center">
                  <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner mr-2">
                    <div className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full" style={{ width: `${kpis.benchmarks.clientWatchlist}%` }} />
                  </div>
                  {kpis.benchmarks.clientWatchlist}% of clients
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-green-600/40 shadow-md hover:shadow-lg transition-all duration-300 hover:border-green-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-blue-900/5 to-green-900/5"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-emerald-900/80">
                  <Zap className="h-6 w-6 text-emerald-300" />
                </div>
                <h3 className="font-medium text-gray-200">Overall System Health</h3>
              </div>
              <div className="mt-4 flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-700 via-blue-700 to-green-700 flex items-center justify-center shadow-2xl p-1">
                      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 text-transparent bg-clip-text">{kpis.systemHealth.overallScore}</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="192" height="192" viewBox="0 0 192 192" className="animate-[spin_10s_linear_infinite]">
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="50%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                      <circle 
                        cx="96" 
                        cy="96" 
                        r="88" 
                        fill="none" 
                        stroke="#374151" 
                        strokeWidth="6"
                      />
                      <circle 
                        cx="96" 
                        cy="96" 
                        r="88" 
                        fill="none" 
                        stroke="url(#gradient)" 
                        strokeWidth="12"
                        strokeDasharray="552.92"
                        strokeDashoffset={552.92 * (1 - kpis.systemHealth.overallScore / 100)}
                        transform="rotate(-90 96 96)"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className={`text-lg font-medium px-4 py-2 rounded-full shadow-md ${
                  kpis.systemHealth.overallScore >= 80 
                    ? 'bg-gradient-to-r from-green-800 to-green-700 text-green-200 border border-green-600' 
                    : kpis.systemHealth.overallScore >= 70
                      ? 'bg-gradient-to-r from-yellow-800 to-yellow-700 text-yellow-200 border border-yellow-600'
                      : 'bg-gradient-to-r from-red-800 to-red-700 text-red-200 border border-red-600'
                }`}>
                  {kpis.systemHealth.overallScore >= 80 
                    ? 'Excellent Health' 
                    : kpis.systemHealth.overallScore >= 70
                      ? 'Good Health'
                      : 'Needs Attention'}
                </div>
                
                <div className="mt-4 flex gap-2 justify-center">
                  <div className="px-3 py-1 rounded-lg bg-gray-800 flex items-center gap-1 border border-gray-700">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-yellow-300">{kpis.systemHealth.alertsCount} Alerts</span>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-gray-800 flex items-center gap-1 border border-gray-700">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-purple-300">{kpis.systemHealth.trendsScore}% Trend</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};