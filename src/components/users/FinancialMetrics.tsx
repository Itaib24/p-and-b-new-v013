import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, Calendar, Clock, ArrowUp, ArrowDown, Briefcase, ChevronDown, ChevronUp, Info, AlertCircle, BarChart4, PieChart, Target, Hourglass, CheckCircle, MessageCircle, Shield, Award, Zap } from 'lucide-react';

export const FinancialMetrics: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('core');
  const [timeFrame, setTimeFrame] = useState<'month' | 'quarter' | 'year'>('month');
  const [showInfo, setShowInfo] = useState<string | null>(null);

  // Financial metrics data (simulated)
  const financialData = {
    monthlyRevenue: 3750,
    revenueTrend: +12.5,
    activeClients: 25,
    clientsTrend: +3,
    churnRate: 8.3,
    churnTrend: -2.1,
    newClients: 5,
    newClientsTrend: +1,
    averageRevenuePerClient: 150,
    arpcTrend: +15,
    hoursPerClient: 0.75,
    hoursTrend: -15,
    hourlyRate: 72.5,
    hourlyRateTrend: +8.2
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatPercent = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };
  
  const formatTime = (hours: number): string => {
    const hrs = Math.floor(hours);
    const mins = Math.round((hours - hrs) * 60);
    return `${hrs}h ${mins}m`;
  };

  const renderTrendIndicator = (value: number, inverse: boolean = false) => {
    const isPositive = inverse ? value < 0 : value > 0;
    const isNeutral = value === 0;
    
    if (isNeutral) {
      return <span className="text-gray-400">―</span>;
    }
    
    return (
      <div className={`flex items-center gap-1 ${
        isPositive ? 'text-green-400' : 'text-red-400'
      }`}>
        {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        <span>{Math.abs(value).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with title and time selector */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-lg p-6 border-b-4 border-green-600">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-r from-green-700 to-green-600 rounded-2xl shadow-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Trainer Business Metrics</h2>
              <p className="text-green-300">Financial insights for your coaching business</p>
            </div>
          </div>
          
          <div className="flex items-center bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-700">
            <button
              onClick={() => setTimeFrame('month')}
              className={`px-4 py-2 ${timeFrame === 'month' 
                ? 'bg-gradient-to-r from-green-700 to-green-600 text-white' 
                : 'text-gray-400 hover:text-white'
              } transition-all duration-200`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeFrame('quarter')}
              className={`px-4 py-2 ${timeFrame === 'quarter' 
                ? 'bg-gradient-to-r from-green-700 to-green-600 text-white' 
                : 'text-gray-400 hover:text-white'
              } transition-all duration-200`}
            >
              Quarter
            </button>
            <button
              onClick={() => setTimeFrame('year')}
              className={`px-4 py-2 ${timeFrame === 'year' 
                ? 'bg-gradient-to-r from-green-700 to-green-600 text-white' 
                : 'text-gray-400 hover:text-white'
              } transition-all duration-200`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Core Financial Metrics */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-lg border-2 border-green-700 overflow-hidden">
        <div 
          className="flex items-center justify-between p-6 border-b border-gray-700 cursor-pointer"
          onClick={() => toggleSection('core')}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-green-700 to-green-600 rounded-xl shadow-md">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Core Financial Metrics</h3>
          </div>
          <button className="p-2 bg-gray-700 rounded-lg">
            {expandedSection === 'core' ? <ChevronUp className="h-5 w-5 text-gray-300" /> : <ChevronDown className="h-5 w-5 text-gray-300" />}
          </button>
        </div>
        
        {expandedSection === 'core' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Monthly Revenue */}
              <div 
                className="bg-gradient-to-br from-green-900/20 to-gray-800 rounded-xl p-5 border-l-4 border-green-600 shadow-lg relative overflow-hidden group hover:from-green-900/30 hover:to-gray-800/80 transition-all duration-300"
                onMouseEnter={() => setShowInfo('revenue')}
                onMouseLeave={() => setShowInfo(null)}
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Monthly Revenue</h4>
                    <div className="text-3xl font-bold text-white mt-1">
                      {formatCurrency(financialData.monthlyRevenue)}
                    </div>
                  </div>
                  <div className="p-3 bg-green-900/50 rounded-xl border border-green-800/50 h-fit">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {renderTrendIndicator(financialData.revenueTrend)}
                  
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>vs last month</span>
                  </div>
                </div>
                
                {showInfo === 'revenue' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-white">
                        <span className="font-medium text-green-400">Total money from active clients this month.</span> Shows if your business is growing or stuck.
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-green-400 font-medium">
                      💡 Tip: Raise prices for new clients every 3–6 months
                    </div>
                  </div>
                )}
              </div>
              
              {/* Active Clients */}
              <div 
                className="bg-gradient-to-br from-blue-900/20 to-gray-800 rounded-xl p-5 border-l-4 border-blue-600 shadow-lg relative overflow-hidden group hover:from-blue-900/30 hover:to-gray-800/80 transition-all duration-300"
                onMouseEnter={() => setShowInfo('active')}
                onMouseLeave={() => setShowInfo(null)}
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Active Paying Clients</h4>
                    <div className="text-3xl font-bold text-white mt-1">
                      {financialData.activeClients}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-900/50 rounded-xl border border-blue-800/50 h-fit">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {renderTrendIndicator(financialData.clientsTrend)}
                  
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>vs last month</span>
                  </div>
                </div>
                
                {showInfo === 'active' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-white">
                        <span className="font-medium text-blue-400">How many clients are actually paying this month.</span> More clients = more income.
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-blue-400 font-medium">
                      💡 Tip: Offer "renewal bonuses" before they churn
                    </div>
                  </div>
                )}
              </div>
              
              {/* Churn Rate */}
              <div 
                className="bg-gradient-to-br from-red-900/20 to-gray-800 rounded-xl p-5 border-l-4 border-red-600 shadow-lg relative overflow-hidden group hover:from-red-900/30 hover:to-gray-800/80 transition-all duration-300"
                onMouseEnter={() => setShowInfo('churn')}
                onMouseLeave={() => setShowInfo(null)}
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Churn Rate</h4>
                    <div className="text-3xl font-bold text-white mt-1">
                      {financialData.churnRate}%
                    </div>
                  </div>
                  <div className="p-3 bg-red-900/50 rounded-xl border border-red-800/50 h-fit">
                    <Users className="h-6 w-6 text-red-400" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {renderTrendIndicator(financialData.churnTrend, true)}
                  
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>vs last month</span>
                  </div>
                </div>
                
                {showInfo === 'churn' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-white">
                        <span className="font-medium text-red-400">% of clients who left this month.</span> Low churn = good business.
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-red-400 font-medium">
                      💡 Tip: Clients quit when they feel unseen. Send 1-1 messages weekly.
                    </div>
                  </div>
                )}
              </div>
              
              {/* New Clients */}
              <div 
                className="bg-gradient-to-br from-purple-900/20 to-gray-800 rounded-xl p-5 border-l-4 border-purple-600 shadow-lg relative overflow-hidden group hover:from-purple-900/30 hover:to-gray-800/80 transition-all duration-300"
                onMouseEnter={() => setShowInfo('new')}
                onMouseLeave={() => setShowInfo(null)}
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">New Clients This Month</h4>
                    <div className="text-3xl font-bold text-white mt-1">
                      {financialData.newClients}
                    </div>
                  </div>
                  <div className="p-3 bg-purple-900/50 rounded-xl border border-purple-800/50 h-fit">
                    <UserPlus className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {renderTrendIndicator(financialData.newClientsTrend)}
                  
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>vs last month</span>
                  </div>
                </div>
                
                {showInfo === 'new' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-white">
                        <span className="font-medium text-purple-400">How many new clients signed up.</span> Shows the growth of your business.
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-purple-400 font-medium">
                      💡 Tip: Promote before/after results on social media every week
                    </div>
                  </div>
                )}
              </div>
              
              {/* Average Revenue Per Client */}
              <div 
                className="bg-gradient-to-br from-amber-900/20 to-gray-800 rounded-xl p-5 border-l-4 border-amber-600 shadow-lg relative overflow-hidden group hover:from-amber-900/30 hover:to-gray-800/80 transition-all duration-300"
                onMouseEnter={() => setShowInfo('arpc')}
                onMouseLeave={() => setShowInfo(null)}
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Avg Revenue Per Client</h4>
                    <div className="text-3xl font-bold text-white mt-1">
                      {formatCurrency(financialData.averageRevenuePerClient)}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-900/50 rounded-xl border border-amber-800/50 h-fit">
                    <BarChart4 className="h-6 w-6 text-amber-400" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {renderTrendIndicator(financialData.arpcTrend)}
                  
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>vs last month</span>
                  </div>
                </div>
                
                {showInfo === 'arpc' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-white">
                        <span className="font-medium text-amber-400">How much each client pays you on average.</span> Helps identify high vs low-value plans.
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-amber-400 font-medium">
                      💡 Tip: Bundle higher ticket options: check-ins, nutrition, group calls
                    </div>
                  </div>
                )}
              </div>
              
              {/* Hours Per Client */}
              <div 
                className="bg-gradient-to-br from-cyan-900/20 to-gray-800 rounded-xl p-5 border-l-4 border-cyan-600 shadow-lg relative overflow-hidden group hover:from-cyan-900/30 hover:to-gray-800/80 transition-all duration-300"
                onMouseEnter={() => setShowInfo('hours')}
                onMouseLeave={() => setShowInfo(null)}
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Avg Hours Per Client/Week</h4>
                    <div className="text-3xl font-bold text-white mt-1">
                      {formatTime(financialData.hoursPerClient)}
                    </div>
                  </div>
                  <div className="p-3 bg-cyan-900/50 rounded-xl border border-cyan-800/50 h-fit">
                    <Hourglass className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {renderTrendIndicator(financialData.hoursTrend, true)}
                  
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>vs last month</span>
                  </div>
                </div>
                
                {showInfo === 'hours' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-white">
                        <span className="font-medium text-cyan-400">How much time each client takes from you.</span> Time = money.
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-cyan-400 font-medium">
                      💡 Tip: Use chatbot + auto check-ins to drop this by 50%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Summary Scorecard */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-lg border-2 border-purple-700 overflow-hidden">
        <div 
          className="flex items-center justify-between p-6 border-b border-gray-700 cursor-pointer"
          onClick={() => toggleSection('summary')}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-700 to-purple-600 rounded-xl shadow-md">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Summary Scorecard</h3>
          </div>
          <button className="p-2 bg-gray-700 rounded-lg">
            {expandedSection === 'summary' ? <ChevronUp className="h-5 w-5 text-gray-300" /> : <ChevronDown className="h-5 w-5 text-gray-300" />}
          </button>
        </div>
        
        {expandedSection === 'summary' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Revenue Growth */}
              <div className="bg-gradient-to-br from-green-900/20 to-gray-800 rounded-xl p-4 border-2 border-green-900/40 shadow-lg relative overflow-hidden">
                <div className="flex flex-col items-center">
                  <div className="mb-3 text-sm text-gray-400">Revenue Growth</div>
                  <div className="text-3xl font-bold text-white">{formatPercent(financialData.revenueTrend)}</div>
                  <div className="mt-1 text-sm px-3 py-1 rounded-full bg-gray-900/60 text-white">
                    Target: ≥10%
                  </div>
                  <div className="mt-3 h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        financialData.revenueTrend >= 10 
                          ? 'bg-gradient-to-r from-green-600 to-green-500' 
                          : 'bg-gradient-to-r from-red-600 to-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (financialData.revenueTrend / 20) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Churn Rate */}
              <div className="bg-gradient-to-br from-red-900/20 to-gray-800 rounded-xl p-4 border-2 border-red-900/40 shadow-lg relative overflow-hidden">
                <div className="flex flex-col items-center">
                  <div className="mb-3 text-sm text-gray-400">Churn Rate</div>
                  <div className="text-3xl font-bold text-white">{financialData.churnRate}%</div>
                  <div className="mt-1 text-sm px-3 py-1 rounded-full bg-gray-900/60 text-white">
                    Target: &lt;10%
                  </div>
                  <div className="mt-3 h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        financialData.churnRate < 10 
                          ? 'bg-gradient-to-r from-green-600 to-green-500' 
                          : 'bg-gradient-to-r from-red-600 to-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (financialData.churnRate / 20) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* ARPC */}
              <div className="bg-gradient-to-br from-purple-900/20 to-gray-800 rounded-xl p-4 border-2 border-purple-900/40 shadow-lg relative overflow-hidden">
                <div className="flex flex-col items-center">
                  <div className="mb-3 text-sm text-gray-400">ARPC</div>
                  <div className="text-3xl font-bold text-white">{formatCurrency(financialData.averageRevenuePerClient)}</div>
                  <div className="mt-1 text-sm px-3 py-1 rounded-full bg-gray-900/60 text-white">
                    Target: ≥$150
                  </div>
                  <div className="mt-3 h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        financialData.averageRevenuePerClient >= 150 
                          ? 'bg-gradient-to-r from-purple-600 to-purple-500' 
                          : 'bg-gradient-to-r from-red-600 to-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (financialData.averageRevenuePerClient / 300) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Hourly Rate */}
              <div className="bg-gradient-to-br from-blue-900/20 to-gray-800 rounded-xl p-4 border-2 border-blue-900/40 shadow-lg relative overflow-hidden">
                <div className="flex flex-col items-center">
                  <div className="mb-3 text-sm text-gray-400">Hourly Rate</div>
                  <div className="text-3xl font-bold text-white">{formatCurrency(financialData.hourlyRate)}</div>
                  <div className="mt-1 text-sm px-3 py-1 rounded-full bg-gray-900/60 text-white">
                    Target: ≥$60/hour
                  </div>
                  <div className="mt-3 h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        financialData.hourlyRate >= 60 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500' 
                          : 'bg-gradient-to-r from-red-600 to-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (financialData.hourlyRate / 120) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Time Per Client */}
              <div className="bg-gradient-to-br from-teal-900/20 to-gray-800 rounded-xl p-4 border-2 border-teal-900/40 shadow-lg relative overflow-hidden">
                <div className="flex flex-col items-center">
                  <div className="mb-3 text-sm text-gray-400">Time Per Client</div>
                  <div className="text-3xl font-bold text-white">{formatTime(financialData.hoursPerClient)}</div>
                  <div className="mt-1 text-sm px-3 py-1 rounded-full bg-gray-900/60 text-white">
                    Target: &lt;30m/week
                  </div>
                  <div className="mt-3 h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        financialData.hoursPerClient < 0.5 
                          ? 'bg-gradient-to-r from-teal-600 to-teal-500' 
                          : 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                      }`}
                      style={{ width: `${Math.min(100, (financialData.hoursPerClient / 2) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Business Improvement Tips */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-lg border-2 border-amber-700 overflow-hidden">
        <div 
          className="flex items-center justify-between p-6 border-b border-gray-700 cursor-pointer"
          onClick={() => toggleSection('tips')}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-amber-700 to-amber-600 rounded-xl shadow-md">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Business Improvement Tips</h3>
          </div>
          <button className="p-2 bg-gray-700 rounded-lg">
            {expandedSection === 'tips' ? <ChevronUp className="h-5 w-5 text-gray-300" /> : <ChevronDown className="h-5 w-5 text-gray-300" />}
          </button>
        </div>
        
        {expandedSection === 'tips' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Raise Retention */}
              <div className="bg-gradient-to-br from-blue-900/20 to-gray-800 rounded-xl p-5 border-2 border-blue-600/40 shadow-lg hover:border-blue-600 transition-all duration-300 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg">
                    <Users className="h-5 w-5 text-blue-300" />
                  </div>
                  <h4 className="font-medium text-blue-300">Raise Retention</h4>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="bg-blue-900/30 px-3 py-2 rounded-lg flex items-center text-white border border-blue-800/30">
                    <span className="h-4 w-4 bg-blue-700 rounded-full flex items-center justify-center text-xs text-white mr-2">✓</span>
                    Message them weekly
                  </li>
                  <li className="bg-blue-900/30 px-3 py-2 rounded-lg flex items-center text-white border border-blue-800/30">
                    <span className="h-4 w-4 bg-blue-700 rounded-full flex items-center justify-center text-xs text-white mr-2">✓</span>
                    Show progress (graphs = dopamine)
                  </li>
                  <li className="bg-blue-900/30 px-3 py-2 rounded-lg flex items-center text-white border border-blue-800/30">
                    <span className="h-4 w-4 bg-blue-700 rounded-full flex items-center justify-center text-xs text-white mr-2">✓</span>
                    Remind them of past accomplishments
                  </li>
                </ul>
              </div>
              
              {/* Raise Prices */}
              <div className="bg-gradient-to-br from-green-900/20 to-gray-800 rounded-xl p-5 border-2 border-green-600/40 shadow-lg hover:border-green-600 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-r from-green-900 to-green-800 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-300" />
                  </div>
                  <h4 className="font-medium text-green-300">Raise Prices</h4>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="bg-green-900/30 px-3 py-2 rounded-lg flex items-center text-white border border-green-800/30">
                    <span className="h-4 w-4 bg-green-700 rounded-full flex items-center justify-center text-xs text-white mr-2">✓</span>
                    Add premium tiers with calls, 1-on-1s
                  </li>
                  <li className="bg-green-900/30 px-3 py-2 rounded-lg flex items-center text-white border border-green-800/30">
                    <span className="h-4 w-4 bg-green-700 rounded-full flex items-center justify-center text-xs text-white mr-2">✓</span>
                    Offer trial weeks + upsell
                  </li>
                  <li className="bg-green-900/30 px-3 py-2 rounded-lg flex items-center text-white border border-green-800/30">
                    <span className="h-4 w-4 bg-green-700 rounded-full flex items-center justify-center text-xs text-white mr-2">✓</span>
                    Custom meal plan add-ons
                  </li>
                </ul>
              </div>
              
              {/* Save Time */}
              <div className="bg-gradient-to-br from-amber-900/20 to-gray-800 rounded-xl p-5 border-2 border-amber-600/40 shadow-lg hover:border-amber-600 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-r from-amber-900 to-amber-800 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-300" />
                  </div>
                  <h4 className="font-medium text-amber-300">Save Time with AI</h4>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="bg-amber-900/30 px-3 py-2 rounded-lg flex items-center text-white border border-amber-800/30">
                    <span className="h-4 w-4 bg-amber-700 rounded-full flex items-center justify-center text-xs text-white mr-2">✓</span>
                    Automate check-ins with AI
                  </li>
                  <li className="bg-amber-900/30 px-3 py-2 rounded-lg flex items-center text-white border border-amber-800/30">
                    <span className="h-4 w-4 bg-amber-700 rounded-full flex items-center justify-center text-xs text-white mr-2">✓</span>
                    Scheduled reminders to clients
                  </li>
                  <li className="bg-amber-900/30 px-3 py-2 rounded-lg flex items-center text-white border border-amber-800/30">
                    <span className="h-4 w-4 bg-amber-700 rounded-full flex items-center justify-center text-xs text-white mr-2">✓</span>
                    Auto-generate meal/workout plans
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Income Potential Calculator */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-lg border-2 border-green-700 overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-green-700 to-green-600 rounded-xl shadow-md">
              <PieChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Income Potential</h3>
              <p className="text-sm text-gray-400">If all clients were on monthly subscription</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-900 to-green-800 p-3 rounded-xl border border-green-700 shadow-lg">
            <div className="text-xs text-green-300 mb-1">Annual Potential</div>
            <div className="text-2xl font-bold text-white">{formatCurrency(financialData.averageRevenuePerClient * financialData.activeClients * 12)}</div>
          </div>
        </div>
      </div>
      
      {/* Business Growth Forecast */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-lg p-6 border-2 border-indigo-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-indigo-700 to-indigo-600 rounded-xl shadow-md">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Business Growth Forecast</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-900/20 to-gray-800 rounded-xl p-5 border-2 border-indigo-600/40 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-indigo-400" />
              <h4 className="font-medium text-gray-200">Conservative</h4>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {formatCurrency(financialData.monthlyRevenue * 12 * 1.1)}
            </div>
            <div className="text-xs text-indigo-400 mb-2">+10% annual growth</div>
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-full w-1/3"></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900/20 to-gray-800 rounded-xl p-5 border-2 border-blue-600/40 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-blue-400" />
              <h4 className="font-medium text-gray-200">Realistic</h4>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {formatCurrency(financialData.monthlyRevenue * 12 * 1.2)}
            </div>
            <div className="text-xs text-blue-400 mb-2">+20% annual growth</div>
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-700 to-blue-500 rounded-full w-1/2"></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/20 to-gray-800 rounded-xl p-5 border-2 border-green-600/40 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-green-400" />
              <h4 className="font-medium text-gray-200">Ambitious</h4>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {formatCurrency(financialData.monthlyRevenue * 12 * 1.5)}
            </div>
            <div className="text-xs text-green-400 mb-2">+50% annual growth</div>
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-700 to-green-500 rounded-full w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendations Alert */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 rounded-3xl shadow-lg p-6 border-l-8 border-yellow-600">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-r from-amber-800 to-amber-700 rounded-xl shadow-md mt-1">
            <AlertCircle className="h-6 w-6 text-yellow-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Key Recommendations</h3>
            <div className="space-y-3">
              <div className="bg-black/20 p-3 rounded-lg border border-amber-700">
                <p className="text-yellow-200">Increase your pricing by 10-15% for new clients to raise your ARPC.</p>
              </div>
              <div className="bg-black/20 p-3 rounded-lg border border-amber-700">
                <p className="text-yellow-200">Implement automated weekly check-ins to reduce time spent per client while increasing retention.</p>
              </div>
              <div className="bg-black/20 p-3 rounded-lg border border-amber-700">
                <p className="text-yellow-200">Contact the 3 clients who haven't checked in for 2+ weeks to reduce potential churn.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function UserPlus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}