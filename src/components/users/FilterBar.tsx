import React from 'react';
import { Filter, Users, Award, Clock, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  filters: {
    status: string;
    performance: string;
    team: string;
    dateRange: string;
  };
  onFilterChange: (filters: any) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-md mb-8 overflow-hidden border-2 border-purple-600/50 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1\" dir="rtl">
      {/* Header */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-700/50 bg-gray-800">
        <div className="w-10 h-10 flex items-center justify-center bg-purple-900 rounded-lg shadow-md">
          <Filter className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-white">סינון מתאמנים</h2>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-5">
        <div>
          <label className="block text-base font-medium text-white mb-2 flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center bg-purple-900 rounded-md shadow-sm">
              <Users className="h-4 w-4 text-white" />
            </div>
            סטטוס
          </label>
          <div className="relative">
            <select
              className="w-full rounded-xl py-3 px-4 appearance-none bg-gray-900 border border-gray-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            >
              <option value="all">כל הסטטוסים</option>
              <option value="active">פעיל</option>
              <option value="inactive">לא פעיל</option>
              <option value="attention">דורש תשומת לב</option>
            </select>
            <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-white mb-2 flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center bg-purple-900 rounded-md shadow-sm">
              <Award className="h-4 w-4 text-white" />
            </div>
            ביצועים
          </label>
          <div className="relative">
            <select
              className="w-full rounded-xl py-3 px-4 appearance-none bg-gray-900 border border-gray-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
              value={filters.performance}
              onChange={(e) => onFilterChange({ ...filters, performance: e.target.value })}
            >
              <option value="all">כל הביצועים</option>
              <option value="above">מעל היעד</option>
              <option value="below">מתחת ליעד</option>
            </select>
            <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-white mb-2 flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center bg-purple-900 rounded-md shadow-sm">
              <Users className="h-4 w-4 text-white" />
            </div>
            רמה
          </label>
          <div className="relative">
            <select
              className="w-full rounded-xl py-3 px-4 appearance-none bg-gray-900 border border-gray-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
              value={filters.team}
              onChange={(e) => onFilterChange({ ...filters, team: e.target.value })}
            >
              <option value="all">כל הרמות</option>
              <option value="beginner">מתחיל</option>
              <option value="intermediate">מתקדם</option>
              <option value="advanced">מקצועי</option>
            </select>
            <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-white mb-2 flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center bg-purple-900 rounded-md shadow-sm">
              <Clock className="h-4 w-4 text-white" />
            </div>
            טווח זמן
          </label>
          <div className="relative">
            <select
              className="w-full rounded-xl py-3 px-4 appearance-none bg-gray-900 border border-gray-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
              value={filters.dateRange}
              onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
            >
              <option value="all">כל הזמן</option>
              <option value="today">היום</option>
              <option value="week">השבוע</option>
              <option value="month">החודש</option>
            </select>
            <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>
      
      {/* Active Filters */}
      {(filters.status !== 'all' || filters.performance !== 'all' || filters.team !== 'all' || filters.dateRange !== 'all') && (
        <div className="px-6 pb-6">
          <div className="p-4 bg-gray-900 rounded-xl border border-gray-700 shadow-md">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="font-medium text-white">מסננים פעילים:</span>
              {filters.status !== 'all' && (
                <span className="px-3 py-2 rounded-lg bg-gray-800 text-white font-medium inline-flex items-center gap-2 shadow-sm border border-purple-700 hover:border-purple-500 transition-all duration-200">
                  <Users className="h-4 w-4 text-purple-400" />
                  {filters.status === 'active' ? 'פעיל' :
                   filters.status === 'inactive' ? 'לא פעיל' :
                   filters.status === 'attention' ? 'דורש תשומת לב' :
                   filters.status}
                </span>
              )}
              {filters.performance !== 'all' && (
                <span className="px-3 py-2 rounded-lg bg-gray-800 text-white font-medium inline-flex items-center gap-2 shadow-sm border border-purple-700 hover:border-purple-500 transition-all duration-200">
                  <Award className="h-4 w-4 text-purple-400" />
                  {filters.performance === 'above' ? 'מעל היעד' : 'מתחת ליעד'}
                </span>
              )}
              {filters.team !== 'all' && (
                <span className="px-3 py-2 rounded-lg bg-gray-800 text-white font-medium inline-flex items-center gap-2 shadow-sm border border-purple-700 hover:border-purple-500 transition-all duration-200">
                  <Users className="h-4 w-4 text-purple-400" />
                  {filters.team === 'beginner' ? 'מתחיל' :
                   filters.team === 'intermediate' ? 'מתקדם' :
                   filters.team === 'advanced' ? 'מקצועי' :
                   filters.team}
                </span>
              )}
              {filters.dateRange !== 'all' && (
                <span className="px-3 py-2 rounded-lg bg-gray-800 text-white font-medium inline-flex items-center gap-2 shadow-sm border border-purple-700 hover:border-purple-500 transition-all duration-200">
                  <Clock className="h-4 w-4 text-purple-400" />
                  {filters.dateRange === 'today' ? 'היום' :
                   filters.dateRange === 'week' ? 'השבוע' :
                   filters.dateRange === 'month' ? 'החודש' :
                   filters.dateRange}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};