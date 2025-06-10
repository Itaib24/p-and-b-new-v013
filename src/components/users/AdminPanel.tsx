import React, { useState } from 'react';
import { UserPlus, X, Check, User, CalendarDays, Target, Activity } from 'lucide-react';

interface AdminPanelProps {
  onAddUser: (userData: {
    name: string;
    email: string;
    avatar: string;
    team: 'beginner' | 'intermediate' | 'advanced';
    goal: 'fat_loss' | 'muscle_gain';
    startingWeight: number;
    startingFatPercentage: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    height: number;
    activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  }) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onAddUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    team: 'beginner' as const,
    goal: 'fat_loss' as const,
    startingWeight: 0,
    startingFatPercentage: 0,
    age: 0,
    gender: 'male' as const,
    height: 0,
    activityLevel: 'moderately_active' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser(formData);
    setFormData({
      name: '',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      team: 'beginner',
      goal: 'fat_loss',
      startingWeight: 0,
      startingFatPercentage: 0,
      age: 0,
      gender: 'male',
      height: 0,
      activityLevel: 'moderately_active'
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gray-800 rounded-xl shadow-md p-6 mb-8 flex items-center justify-center gap-4 group border-2 border-purple-600/50 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="p-4 bg-purple-900 rounded-xl shadow-md group-hover:rotate-12 transition-transform duration-300">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-200">הוסף מתאמן חדש</span>
      </button>
    );
  }

  return (
    <div className="w-full bg-gray-800 rounded-xl shadow-md p-6 mb-8 border-2 border-purple-600/50 hover:border-purple-500 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-900 rounded-xl shadow-md">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">הוסף מתאמן חדש</h2>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-gray-700 rounded-xl transition-colors duration-200"
        >
          <X className="h-6 w-6 text-white" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-md border-2 border-purple-700/30 hover:border-purple-600/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-900">
              <User className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-medium text-white">מידע בסיסי</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-gray-700 text-white shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                placeholder="שם המתאמן"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-gray-700 text-white shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                placeholder="example@email.com"
              />
            </div>
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-md border-2 border-purple-700/30 hover:border-purple-600/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-900">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-medium text-white">פרטים דמוגרפיים</h3>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Age</label>
              <input
                type="number"
                required
                min="0"
                max="120"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-gray-700 text-white shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                placeholder="25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-gray-700 text-white shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Level</label>
              <select
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-gray-700 text-white shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Measurements */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-md border-2 border-purple-700/30 hover:border-purple-600/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-900">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-medium text-white">מדדים</h3>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Height (cm)</label>
              <input
                type="number"
                required
                min="0"
                max="300"
                value={formData.height || ''}
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-gray-700 text-white shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                placeholder="175"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Starting Weight (kg)</label>
              <input
                type="number"
                required
                min="0"
                max="300"
                value={formData.startingWeight || ''}
                onChange={(e) => setFormData({ ...formData, startingWeight: parseFloat(e.target.value) })}
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-gray-700 text-white shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                placeholder="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Starting Body Fat (%)</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.startingFatPercentage || ''}
                onChange={(e) => setFormData({ ...formData, startingFatPercentage: parseFloat(e.target.value) })}
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-gray-700 text-white shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                placeholder="20"
              />
            </div>
          </div>
        </div>

        {/* Goals and Activity */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-md border-2 border-purple-700/30 hover:border-purple-600/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-900">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-medium text-white">יעדים ורמת פעילות</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Goal</label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value as 'fat_loss' | 'muscle_gain' })}
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-gray-700 text-white shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
              >
                <option value="fat_loss">Fat Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Activity Level</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active' })}
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-gray-700 text-white shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
                <option value="extra_active">Extra Active (very hard exercise & physical job)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-purple-800 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 font-bold shadow-md border-b-2 border-purple-900 transform hover:scale-105"
          >
            <Check className="h-5 w-5" />
            <span>Add Member</span>
          </button>
        </div>
      </form>
    </div>
  );
};