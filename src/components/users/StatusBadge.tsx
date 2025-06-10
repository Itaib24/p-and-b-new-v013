import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-800 text-green-300 border-green-700';
      case 'inactive':
        return 'bg-gray-800 text-gray-300 border-gray-700';
      case 'attention':
        return 'bg-red-800 text-red-300 border-red-700';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'פעיל';
      case 'inactive':
        return 'לא פעיל';
      case 'attention':
        return 'דורש תשומת לב';
      default:
        return status;
    }
  };

  return (
    <span 
      className={`py-2 px-4 text-sm font-medium rounded-xl inline-block shadow-md border-2 transform hover:scale-105 transition-all duration-300 ${getStatusStyles()}`}
    >
      {getStatusText(status)}
    </span>
  );
};