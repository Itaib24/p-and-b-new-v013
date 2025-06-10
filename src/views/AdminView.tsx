import React, { useState } from 'react';
import { ChevronRight, LayoutDashboard, Users, BarChart, Settings, Menu, X } from 'lucide-react';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminTrainers } from '../components/admin/AdminTrainers';
import { AdminAnalytics } from '../components/admin/AdminAnalytics';
import { AdminSettings } from '../components/admin/AdminSettings';

interface AdminViewProps {
  onBackToSelect: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBackToSelect }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-4 py-4 shadow-lg sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToSelect}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="hidden md:inline">Back to View Selection</span>
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 text-transparent bg-clip-text">Admin Dashboard</h1>
          
          {/* Mobile menu button */}
          <button 
            className="p-2 rounded-lg bg-gray-800 text-gray-200 md:hidden" 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Desktop */}
        <div className="hidden md:block w-64 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 p-4 shadow-lg">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white shadow-md border border-purple-700'
                  : 'hover:bg-gray-700 text-gray-300 border border-transparent'
              }`}
            >
              <LayoutDashboard className={`h-5 w-5 ${activeTab === 'dashboard' ? 'text-purple-300' : 'text-gray-400'}`} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('trainers')}
              className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'trainers'
                  ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white shadow-md border border-purple-700'
                  : 'hover:bg-gray-700 text-gray-300 border border-transparent'
              }`}
            >
              <Users className={`h-5 w-5 ${activeTab === 'trainers' ? 'text-purple-300' : 'text-gray-400'}`} />
              <span className="font-medium">Trainers</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white shadow-md border border-purple-700'
                  : 'hover:bg-gray-700 text-gray-300 border border-transparent'
              }`}
            >
              <BarChart className={`h-5 w-5 ${activeTab === 'analytics' ? 'text-purple-300' : 'text-gray-400'}`} />
              <span className="font-medium">Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white shadow-md border border-purple-700'
                  : 'hover:bg-gray-700 text-gray-300 border border-transparent'
              }`}
            >
              <Settings className={`h-5 w-5 ${activeTab === 'settings' ? 'text-purple-300' : 'text-gray-400'}`} />
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-30 md:hidden">
            <div className="bg-gray-900 w-64 h-full border-r border-gray-700 p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl text-white">Admin Menu</h2>
                <button onClick={() => setShowMobileMenu(false)}>
                  <X className="h-6 w-6 text-gray-300" />
                </button>
              </div>
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-300 flex items-center gap-3 ${
                    activeTab === 'dashboard'
                      ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white shadow-md border border-purple-700'
                      : 'hover:bg-gray-700 text-gray-300 border border-transparent'
                  }`}
                >
                  <LayoutDashboard className={`h-5 w-5 ${activeTab === 'dashboard' ? 'text-purple-300' : 'text-gray-400'}`} />
                  <span className="font-medium">Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('trainers');
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-300 flex items-center gap-3 ${
                    activeTab === 'trainers'
                      ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white shadow-md border border-purple-700'
                      : 'hover:bg-gray-700 text-gray-300 border border-transparent'
                  }`}
                >
                  <Users className={`h-5 w-5 ${activeTab === 'trainers' ? 'text-purple-300' : 'text-gray-400'}`} />
                  <span className="font-medium">Trainers</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('analytics');
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-300 flex items-center gap-3 ${
                    activeTab === 'analytics'
                      ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white shadow-md border border-purple-700'
                      : 'hover:bg-gray-700 text-gray-300 border border-transparent'
                  }`}
                >
                  <BarChart className={`h-5 w-5 ${activeTab === 'analytics' ? 'text-purple-300' : 'text-gray-400'}`} />
                  <span className="font-medium">Analytics</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left rounded-xl transition-all duration-300 flex items-center gap-3 ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white shadow-md border border-purple-700'
                      : 'hover:bg-gray-700 text-gray-300 border border-transparent'
                  }`}
                >
                  <Settings className={`h-5 w-5 ${activeTab === 'settings' ? 'text-purple-300' : 'text-gray-400'}`} />
                  <span className="font-medium">Settings</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-900">
          {/* Mobile tab selector */}
          <div className="md:hidden mb-4 overflow-x-auto whitespace-nowrap p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('trainers')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'trainers'
                  ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              Trainers
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              Settings
            </button>
          </div>
          
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'trainers' && <AdminTrainers />}
          {activeTab === 'analytics' && <AdminAnalytics />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  );
};