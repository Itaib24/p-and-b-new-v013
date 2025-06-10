import React from 'react';
import { Calendar, Clock, User, ArrowDown, ArrowUp, Dumbbell, Pizza, Target } from 'lucide-react';

interface AdjustmentEvent {
  date: string;
  userId: string;
  userName: string;
  type: 'nutrition' | 'workout' | 'combined';
  details: {
    calorieChange?: number;
    macroChanges?: {
      protein?: number;
      carbs?: number;
      fats?: number;
    };
    workoutChanges?: {
      overloadAdjustment?: 'increase' | 'decrease' | 'none';
      deload?: boolean;
      exerciseChanges?: number;
    };
  };
  reason: string;
  weeklyTarget?: number;
}

interface AdjustmentHistoryProps {
  adjustments: AdjustmentEvent[];
  onViewDetails: (adjustment: AdjustmentEvent) => void;
}

export const AdjustmentHistory: React.FC<AdjustmentHistoryProps> = ({ 
  adjustments,
  onViewDetails 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-md border-2 border-purple-600/50 hover:border-purple-500 transition-all duration-300 overflow-hidden" dir="rtl">
      <div className="bg-purple-900/20 p-4 border-b border-gray-700 flex items-center gap-3">
        <Calendar className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">היסטוריית התאמות תוכנית</h3>
      </div>
      
      {adjustments.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mb-4 bg-purple-900/30 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-purple-300" />
          </div>
          <h4 className="text-lg font-medium text-white mb-2">אין היסטוריית התאמות</h4>
          <p className="text-gray-400 max-w-md mx-auto">
            טרם בוצעו התאמות לתוכנית. כאשר תבצע התאמות, הן יופיעו כאן.
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {adjustments.map((adjustment, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-purple-600/40 transition-all duration-200 cursor-pointer"
                onClick={() => onViewDetails(adjustment)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      adjustment.type === 'nutrition' ? 'bg-green-900/70' : 
                      adjustment.type === 'workout' ? 'bg-blue-900/70' : 
                      'bg-purple-900/70'
                    }`}>
                      {adjustment.type === 'nutrition' ? 
                        <Pizza className="h-4 w-4 text-green-300" /> :
                        adjustment.type === 'workout' ? 
                        <Dumbbell className="h-4 w-4 text-blue-300" /> :
                        <Target className="h-4 w-4 text-purple-300" />
                      }
                    </div>
                    <span className="font-medium text-white">{adjustment.userName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDate(adjustment.date)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {adjustment.details.calorieChange !== undefined && (
                    <div className={`px-3 py-1 rounded-lg text-sm flex items-center justify-center gap-1 ${
                      adjustment.details.calorieChange > 0 
                        ? 'bg-green-900/40 text-green-300 border border-green-700/40' 
                        : 'bg-amber-900/40 text-amber-300 border border-amber-700/40'
                    }`}>
                      {adjustment.details.calorieChange > 0 
                        ? <ArrowUp className="h-3 w-3" />
                        : <ArrowDown className="h-3 w-3" />
                      }
                      <span>
                        {adjustment.details.calorieChange > 0 
                          ? `+${adjustment.details.calorieChange}` 
                          : adjustment.details.calorieChange
                        } קלוריות
                      </span>
                    </div>
                  )}
                  
                  {adjustment.details.workoutChanges?.overloadAdjustment && (
                    <div className={`px-3 py-1 rounded-lg text-sm flex items-center justify-center gap-1 ${
                      adjustment.details.workoutChanges.overloadAdjustment === 'increase' 
                        ? 'bg-blue-900/40 text-blue-300 border border-blue-700/40' 
                        : adjustment.details.workoutChanges.overloadAdjustment === 'decrease'
                        ? 'bg-amber-900/40 text-amber-300 border border-amber-700/40'
                        : 'bg-gray-800 text-gray-300 border border-gray-700'
                    }`}>
                      {adjustment.details.workoutChanges.overloadAdjustment === 'increase' 
                        ? <ArrowUp className="h-3 w-3" />
                        : adjustment.details.workoutChanges.overloadAdjustment === 'decrease'
                        ? <ArrowDown className="h-3 w-3" />
                        : null
                      }
                      <span>
                        {adjustment.details.workoutChanges.overloadAdjustment === 'increase' 
                          ? 'הגדלת עומס'
                          : adjustment.details.workoutChanges.overloadAdjustment === 'decrease'
                          ? 'הפחתת עומס'
                          : 'ללא שינוי'
                        }
                      </span>
                    </div>
                  )}
                  
                  {adjustment.weeklyTarget !== undefined && (
                    <div className="px-3 py-1 rounded-lg text-sm flex items-center justify-center gap-1 bg-purple-900/40 text-purple-300 border border-purple-700/40">
                      <Target className="h-3 w-3" />
                      <span>יעד {adjustment.weeklyTarget} ק"ג</span>
                    </div>
                  )}
                  
                  {adjustment.details.workoutChanges?.deload && (
                    <div className="px-3 py-1 rounded-lg text-sm flex items-center justify-center gap-1 bg-indigo-900/40 text-indigo-300 border border-indigo-700/40">
                      <ArrowDown className="h-3 w-3" />
                      <span>שבוע דילואד</span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-400 line-clamp-2">
                  {adjustment.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};