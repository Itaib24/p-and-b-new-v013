import React from 'react';
import { ChevronRight } from 'lucide-react';
import App from '../components/App';
import { UserScopes } from '../components/user/UserScopes';
import { UserScopeVisibilityProvider } from '../contexts/UserScopeVisibilityContext';
import { ProgressProvider } from '../contexts/ProgressTrackingContext';

interface TrainerViewProps {
  onBackToSelect: () => void;
}

export const TrainerView: React.FC<TrainerViewProps> = ({ onBackToSelect }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-4 py-4 shadow-lg">
        <button
          onClick={onBackToSelect}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
        >
          <ChevronRight className="h-5 w-5" />
          <span>Back to View Selection</span>
        </button>
      </div>
      <App />
    </div>
  );
};