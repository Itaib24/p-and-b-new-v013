import React from 'react';
import { ChevronRight, Dumbbell, Calendar, MessageSquare, CheckSquare, Target, AlertCircle, ChevronDown, ChevronUp, Info, Zap, Check, X } from 'lucide-react';

interface WeeklyReportCardProps {
  userId: string;
  userName: string;
  weekStartDate: string;
  weekEndDate: string;
  data: {
    weightChange: number;
    workoutAdherence: number;
    nutritionAdherence: number;
    weeklyTarget: {
      weight: number;
      workouts: number;
      nutrition: number;
    };
    completedWorkouts: number;
    totalPlannedWorkouts: number;
    topExercises: { name: string; performance: number }[];
    challengeAreas: string[];
    notes: string;
  };
  onViewDetails: () => void;
}

export const WeeklyReportCard: React.FC<WeeklyReportCardProps> = ({
  userId,
  userName,
  weekStartDate,
  weekEndDate,
  data,
  onViewDetails
}) => {
  const [expanded, setExpanded] = React.useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'numeric',
    });
  };
  
  // Calculate status of each metric
  const getWeightStatus = () => {
    if (data.weightChange === 0) return { label: 'ללא שינוי', color: 'text-gray-300 bg-gray-700 border-gray-600' };
    
    // For weight loss goal
    if (data.weeklyTarget.weight < 0) {
      return data.weightChange <= data.weeklyTarget.weight
        ? { label: 'עומד ביעד', color: 'text-green-300 bg-green-900/60 border-green-700' }
        : { label: 'מתחת ליעד', color: 'text-red-300 bg-red-900/60 border-red-700' };
    }
    
    // For weight gain goal
    return data.weightChange >= data.weeklyTarget.weight
      ? { label: 'עומד ביעד', color: 'text-green-300 bg-green-900/60 border-green-700' }
      : { label: 'מתחת ליעד', color: 'text-red-300 bg-red-900/60 border-red-700' };
  };
  
  const getAdherenceStatus = (actual: number, target: number) => {
    if (actual >= target) {
      return { label: 'עומד ביעד', color: 'text-green-300 bg-green-900/60 border-green-700' };
    } else if (actual >= target * 0.8) {
      return { label: 'כמעט ביעד', color: 'text-yellow-300 bg-yellow-900/60 border-yellow-700' };
    } else {
      return { label: 'מתחת ליעד', color: 'text-red-300 bg-red-900/60 border-red-700' };
    }
  };
  
  const weightStatus = getWeightStatus();
  const workoutStatus = getAdherenceStatus(data.workoutAdherence, data.weeklyTarget.workouts);
  const nutritionStatus = getAdherenceStatus(data.nutritionAdherence, data.weeklyTarget.nutrition);
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 hover:border-purple-600/50 transition-all duration-300 overflow-hidden" dir="rtl">
      <div 
        className="p-4 bg-gradient-to-r from-gray-800/90 to-gray-800/70 border-b border-gray-700 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-900/80 shadow-md">
            <Calendar className="h-5 w-5 text-purple-300" />
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              {userName} - דוח שבועי
              <span className="text-xs bg-purple-900/60 px-2 py-0.5 rounded-full text-purple-300 border border-purple-800/50">
                {formatDate(weekStartDate)} - {formatDate(weekEndDate)}
              </span>
            </h3>
            <div className="text-sm text-gray-400 mt-0.5">
              {data.completedWorkouts}/{data.totalPlannedWorkouts} אימונים הושלמו
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex">
            {data.challengeAreas.length > 0 && (
              <div className="bg-red-900/70 text-red-300 border border-red-700 rounded-full h-7 w-7 flex items-center justify-center mr-2\" title="אזורי אתגר">
                <AlertCircle className="h-4 w-4" />
              </div>
            )}
            <div className={`px-3 py-1 rounded-full text-sm border flex items-center gap-1 ${
              data.completedWorkouts >= data.totalPlannedWorkouts
                ? 'bg-green-900/70 text-green-300 border-green-700'
                : data.completedWorkouts >= data.totalPlannedWorkouts * 0.7
                ? 'bg-yellow-900/70 text-yellow-300 border-yellow-700'
                : 'bg-red-900/70 text-red-300 border-red-700'
            }`}>
              {data.workoutAdherence}% היענות
            </div>
          </div>
          <button className="p-2 bg-gray-700 rounded-full">
            {expanded ? <ChevronUp className="h-5 w-5 text-white" /> : <ChevronDown className="h-5 w-5 text-white" />}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4">
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3">
              {/* Weight */}
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium text-white">שינוי במשקל</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-white">
                    {data.weightChange > 0 ? '+' : ''}{data.weightChange} ק"ג
                  </div>
                  <div className={`px-2 py-0.5 text-xs rounded-full border ${weightStatus.color}`}>
                    {weightStatus.label}
                  </div>
                </div>
                <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    weightStatus.label === 'עומד ביעד'
                      ? 'bg-gradient-to-r from-green-600 to-green-500'
                      : 'bg-gradient-to-r from-red-600 to-red-500'
                  }`} style={{ width: `${Math.min(100, Math.abs(data.weightChange / data.weeklyTarget.weight * 100))}%` }}></div>
                </div>
                <div className="mt-1 text-xs text-gray-400 flex justify-between">
                  <span>יעד: {data.weeklyTarget.weight > 0 ? '+' : ''}{data.weeklyTarget.weight} ק"ג</span>
                </div>
              </div>
              
              {/* Workout Adherence */}
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">היענות לאימונים</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-white">
                    {data.workoutAdherence}%
                  </div>
                  <div className={`px-2 py-0.5 text-xs rounded-full border ${workoutStatus.color}`}>
                    {workoutStatus.label}
                  </div>
                </div>
                <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    data.workoutAdherence >= data.weeklyTarget.workouts
                      ? 'bg-gradient-to-r from-green-600 to-green-500'
                      : data.workoutAdherence >= data.weeklyTarget.workouts * 0.8
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                      : 'bg-gradient-to-r from-red-600 to-red-500'
                  }`} style={{ width: `${Math.min(100, (data.workoutAdherence / data.weeklyTarget.workouts) * 100)}%` }}></div>
                </div>
                <div className="mt-1 text-xs text-gray-400 flex justify-between">
                  <span>יעד: {data.weeklyTarget.workouts}%</span>
                  <span>{data.completedWorkouts}/{data.totalPlannedWorkouts} הושלמו</span>
                </div>
              </div>
              
              {/* Nutrition Adherence */}
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <CheckSquare className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-white">היענות לתזונה</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-white">
                    {data.nutritionAdherence}%
                  </div>
                  <div className={`px-2 py-0.5 text-xs rounded-full border ${nutritionStatus.color}`}>
                    {nutritionStatus.label}
                  </div>
                </div>
                <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    data.nutritionAdherence >= data.weeklyTarget.nutrition
                      ? 'bg-gradient-to-r from-green-600 to-green-500'
                      : data.nutritionAdherence >= data.weeklyTarget.nutrition * 0.8
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                      : 'bg-gradient-to-r from-red-600 to-red-500'
                  }`} style={{ width: `${Math.min(100, (data.nutritionAdherence / data.weeklyTarget.nutrition) * 100)}%` }}></div>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  <span>יעד: {data.weeklyTarget.nutrition}%</span>
                </div>
              </div>
            </div>
            
            {/* Top Exercises & Challenges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                <h4 className="font-medium text-white mb-3">תרגילים מובילים</h4>
                
                {data.topExercises.length > 0 ? (
                  <div className="space-y-2">
                    {data.topExercises.map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg border border-gray-700">
                        <span className="text-gray-300">{exercise.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-white">{exercise.performance}%</span>
                          <Zap className={`h-3.5 w-3.5 ${
                            exercise.performance >= 90 ? 'text-green-400' : 
                            exercise.performance >= 75 ? 'text-blue-400' :
                            'text-gray-400'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-3">
                    אין נתונים זמינים
                  </div>
                )}
              </div>
              
              <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                <h4 className="font-medium text-white mb-3">אזורי אתגר</h4>
                
                {data.challengeAreas.length > 0 ? (
                  <div className="space-y-2">
                    {data.challengeAreas.map((area, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-red-900/30 rounded-lg border border-red-800/40">
                        <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{area}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-3">
                    אין אתגרים מיוחדים השבוע
                  </div>
                )}
              </div>
            </div>
            
            {/* Notes */}
            {data.notes && (
              <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                  הערות
                </h4>
                <p className="text-gray-300 text-sm">{data.notes}</p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={onViewDetails}
                className="flex items-center gap-2 px-5 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
              >
                <Info className="h-4 w-4" />
                <span>פרטים מלאים</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};