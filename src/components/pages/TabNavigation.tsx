import React from 'react';
import { Layout, Calendar, Dumbbell, ClipboardList, Clock } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "overview", label: "סקירה כללית", icon: Layout },
    { id: "mealplan", label: "תוכנית תזונה", icon: Calendar },
    { id: "training", label: "תוכנית אימונים", icon: Dumbbell },
    { id: "workoutlogs", label: "יומן אימונים", icon: ClipboardList },
    { id: "firstweek", label: "שבוע ראשון", icon: Clock }
  ];
  
  return (
    <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 flex gap-1" dir="rtl">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`
            p-3 text-sm font-semibold uppercase transition-all duration-200 rounded-lg
            flex items-center gap-2 group
            ${activeTab === id
              ? "bg-gradient-to-r from-purple-700 to-purple-800 text-white shadow-md"
              : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            }
          `}
        >
          <Icon className={`w-4 h-4 ${
            activeTab === id 
              ? "text-purple-300 transform group-hover:rotate-12 transition-transform duration-300" 
              : "text-gray-500 group-hover:text-purple-400 transform group-hover:rotate-12 transition-all duration-300"
          }`} />
          {label}
        </button>
      ))}
    </div>
  );
};