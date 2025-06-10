import React from 'react';
import { getOverviewById } from '../../data/overview';
import { User, Trophy, Target, Activity, Ruler, Scale, Goal, UserCircle2 } from 'lucide-react';
import { UserScopes } from '../user/UserScopes';

interface HeaderProps {
  userId: string;
}

export const Header: React.FC<HeaderProps> = ({ userId }) => {
  const overview = getOverviewById(userId);

  return (
    <div className="p-4 border-b border-gray-700 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800" dir="rtl">
      <div className="text-sm uppercase mb-3 text-gray-400 font-semibold flex items-center gap-2">
        <User className="h-4 w-4" />
        Profile Details
      </div>
      
      {/* User Profile Header */}
      <div className="flex items-start gap-4 group mb-4">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User Photo"
            className="relative w-12 h-12 rounded-full object-cover transform group-hover:scale-105 transition-transform duration-300 border-2 border-gray-700 group-hover:border-gray-600"
          />
        </div>
        <div>
          <div className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors duration-200">
            {overview.userName}
          </div>
          <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
            {overview.userId}
          </div>
        </div>
      </div>

      {/* Demographics & Measurements */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Demographics */}
        <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-all duration-200 group">
          <div className="flex items-center gap-2 mb-2">
            <UserCircle2 className="h-4 w-4 text-blue-400 transform group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-sm font-medium text-gray-300">Demographics</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="text-xs text-gray-400">Age</div>
              <div className="text-sm font-semibold text-white">23</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-400">Gender</div>
              <div className="text-sm font-semibold text-white">Male</div>
            </div>
          </div>
        </div>

        {/* Measurements */}
        <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-all duration-200 group">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-4 w-4 text-emerald-400 transform group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-sm font-medium text-gray-300">Measurements</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="text-xs text-gray-400">Weight</div>
              <div className="text-sm font-semibold text-white">80 kg</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-400">Height</div>
              <div className="text-sm font-semibold text-white">185 cm</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity & Goals */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-all duration-200 group">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-purple-400 transform group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-sm font-medium text-gray-300">Activity Level</span>
          </div>
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
            <span className="text-sm font-medium text-purple-300">Active</span>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-all duration-200 group">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-yellow-400 transform group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-sm font-medium text-gray-300">Fitness Goal</span>
          </div>
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
            <span className="text-sm font-medium text-yellow-300">Weight Loss</span>
          </div>
        </div>
      </div>
    </div>
  );
};