import React, { useState } from 'react';
import { Edit2, ChevronRight, Zap, Calendar } from 'lucide-react';
import { ClientProgramAdjuster } from './ClientProgramAdjuster';

interface ClientAdjustmentButtonProps {
  userId: string;
  userName: string;
  onAdjustmentComplete?: () => void;
}

export const ClientAdjustmentButton: React.FC<ClientAdjustmentButtonProps> = ({ 
  userId, 
  userName,
  onAdjustmentComplete 
}) => {
  const [showAdjuster, setShowAdjuster] = useState(false);
  
  const handleClose = () => {
    setShowAdjuster(false);
    if (onAdjustmentComplete) onAdjustmentComplete();
  };
  
  return (
    <>
      <button
        onClick={() => setShowAdjuster(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-500 transition-all duration-300 shadow-md border-b-2 border-purple-900 transform hover:scale-105"
      >
        <Edit2 className="h-5 w-5" />
        <span>התאמת תוכנית אימונים ותזונה</span>
      </button>
      
      {showAdjuster && (
        <ClientProgramAdjuster
          userId={userId}
          onClose={handleClose}
        />
      )}
    </>
  );
};

// Additional component for tracking adjustment history
export const AdjustmentHistoryButton: React.FC<{
  userId: string;
  hasHistory: boolean;
}> = ({ userId, hasHistory }) => {
  const [showHistory, setShowHistory] = useState(false);
  
  return (
    <button
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white shadow-md transition-all duration-300 ${
        hasHistory 
          ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 border-b-2 border-blue-900'
          : 'bg-gray-700 cursor-default opacity-75'
      }`}
      onClick={() => hasHistory && setShowHistory(true)}
      disabled={!hasHistory}
    >
      <Calendar className="h-5 w-5" />
      <span>היסטוריית התאמות</span>
      {hasHistory && (
        <span className="bg-blue-900 px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center justify-center min-w-5 min-h-5">
          <Zap className="h-3 w-3" />
        </span>
      )}
    </button>
  );
};