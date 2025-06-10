import React from 'react';
import { User } from '../../types/user';
import { AlertTriangle, TrendingDown, Clock, ChevronLeft } from 'lucide-react';
import { getLastMessageDate } from '../../utils/messageUtils';
import { formatDate } from '../../utils/dateUtils';

interface AlertCardProps {
  title: string;
  count: number;
  type: 'attention' | 'performance' | 'overdue';
  users: User[];
  onUserSelect: (userId: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ title, count, type, users, onUserSelect }) => {
  const getIcon = () => {
    switch (type) {
      case 'attention':
        return <AlertTriangle className="h-6 w-6 text-white" />;
      case 'performance':
        return <TrendingDown className="h-6 w-6 text-white" />;
      case 'overdue':
        return <Clock className="h-6 w-6 text-white" />;
    }
  };
  
  const getIconColor = () => {
    switch (type) {
      case 'attention':
        return 'bg-red-900';
      case 'performance':
        return 'bg-amber-900';
      case 'overdue':
        return 'bg-blue-900';
    }
  };
  
  const getAlertColor = () => {
    switch (type) {
      case 'attention':
        return 'bg-red-900 text-red-200 border-red-700';
      case 'performance':
        return 'bg-amber-900 text-amber-200 border-amber-700';
      case 'overdue':
        return 'bg-blue-900 text-blue-200 border-blue-700';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-md border-2 border-purple-600/50 hover:border-purple-500 transition-all duration-300 overflow-hidden transform hover:-translate-y-1" dir="rtl">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-gray-700/50 bg-gray-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 flex items-center justify-center ${getIconColor()} rounded-lg shadow-md`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">{title}</h3>
            <div className="text-sm text-gray-300">{count} מתאמנים</div>
          </div>
        </div>
        <div className="text-2xl font-bold text-white bg-purple-900 h-10 w-10 flex items-center justify-center rounded-lg shadow-inner border border-purple-800">
          {count}
        </div>
      </div>

      {/* Users List */}
      <div className="px-6 pb-6 space-y-3 pt-3">
        {users.slice(0, 3).map((user) => {
          const lastMessageDate = getLastMessageDate(user.id);
          const lastActive = lastMessageDate ? formatDate(lastMessageDate) : 'Never';
          
          return (
            <div 
              key={user.id} 
              onClick={() => onUserSelect(user.id)}
              className="bg-gray-900 rounded-xl p-4 cursor-pointer hover:bg-gray-700 transition-all duration-300 group border border-gray-700 hover:border-purple-500 shadow-md transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      className="h-10 w-10 rounded-lg object-cover border border-purple-500 transition-colors duration-300" 
                      src={user.avatar} 
                      alt="" 
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-purple-300 transition-colors duration-200">
                      {user.name}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400 group-hover:text-gray-300">
                      <Clock className="h-3 w-3" />
                      <span>{lastActive}</span>
                    </div>
                  </div>
                </div>
                <ChevronLeft className="h-5 w-5 text-gray-500 group-hover:text-purple-400 transform group-hover:translate-x-1 transition-all duration-200" />
              </div>
              {user.attentionNote && (
                <div className={`mt-3 text-sm px-4 py-2 rounded-lg flex items-center gap-2 ${getAlertColor()} shadow-md`}>
                  {type === 'attention' && <AlertTriangle className="h-4 w-4 flex-shrink-0" />}
                  {type === 'performance' && <TrendingDown className="h-4 w-4 flex-shrink-0" />}
                  {type === 'overdue' && <Clock className="h-4 w-4 flex-shrink-0" />}
                  <span>{user.attentionNote}</span>
                </div>
              )}
            </div>
          );
        })}
        {users.length > 3 && (
          <button className="w-full py-3 bg-gray-800 rounded-xl text-sm font-medium text-white hover:bg-purple-900 transition-all duration-300 flex items-center justify-center gap-2 group border border-gray-700 hover:border-purple-500 shadow-md">
            הצג עוד {users.length - 3} מתאמנים
            <ChevronLeft className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        )}
      </div>
    </div>
  );
};