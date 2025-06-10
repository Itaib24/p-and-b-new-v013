import React, { useState } from 'react';
import { ChangeAlertCard } from './ChangeAlertCard';
import { User } from '../../types/user';
import { ChangeRecommendation, NutritionChange, WorkoutChange } from '../../types/progress';
import { BellRing, X, ChevronDown, ChevronUp, AlertTriangle, Info } from 'lucide-react';

interface ChangeAlertsContainerProps {
  users: User[];
  recommendations: Record<string, ChangeRecommendation>;
  onAccept: (recommendationId: string) => void;
  onReject: (recommendationId: string) => void;
  onOverride: (recommendationId: string) => void;
  onEditAndAccept?: (
    recommendationId: string, 
    nutritionChange?: NutritionChange, 
    workoutChange?: WorkoutChange
  ) => void;
}

export const ChangeAlertsContainer: React.FC<ChangeAlertsContainerProps> = ({
  users,
  recommendations,
  onAccept,
  onReject,
  onOverride,
  onEditAndAccept
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  
  const recIds = Object.keys(recommendations);
  
  if (recIds.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-md border-2 border-purple-600/50 hover:border-purple-500 transition-all duration-300 overflow-hidden mb-8" dir="rtl">
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-purple-900/30 to-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-900 rounded-lg flex items-center justify-center animate-pulse shadow-md">
            <BellRing className="h-6 w-6 text-purple-300" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              התראות שינוי למאמן
              <span className="inline-flex items-center justify-center bg-red-700 text-white text-sm rounded-full h-6 w-6 border border-red-600">
                {recIds.length}
              </span>
            </h2>
            <p className="text-sm text-gray-300">התאמות מומלצות למתאמנים על ידי המערכת</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
          >
            <Info className="h-5 w-5" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="p-4 bg-blue-900/30 border-b border-blue-700/50" dir="rtl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-blue-200">
                <span className="font-semibold">מערכת התראות שינוי:</span> המלצות אלה נוצרות בהתבסס על נתוני המתאמנים, עמידה ביעדים ומדדי התקדמות.
              </p>
              <ul className="mt-2 space-y-1 text-sm text-blue-300">
                <li>• <span className="font-medium text-blue-200">אשר:</span> החל את השינויים המומלצים בתוכנית המתאמן</li>
                <li>• <span className="font-medium text-blue-200">דחה:</span> סגור את ההתראה ללא ביצוע שינויים</li>
                <li>• <span className="font-medium text-blue-200">התאמה אישית:</span> התאם את ההודעה או ההמלצה</li>
                <li>• <span className="font-medium text-blue-200">התאמה מלאה:</span> פתח את כלי ההתאמה המלא עם כל האפשרויות</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div className="p-4">
          <div className="space-y-4">
            {recIds.map(recId => {
              const rec = recommendations[recId];
              const user = users.find(u => u.id === rec.userId);
              if (!user) return null;
              
              return (
                <ChangeAlertCard
                  key={recId}
                  user={{
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                  }}
                  recommendation={rec}
                  onAccept={onAccept}
                  onReject={onReject}
                  onOverride={onOverride}
                  onEditAndAccept={onEditAndAccept}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};