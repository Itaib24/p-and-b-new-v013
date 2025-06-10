import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Info, 
  TrendingDown, 
  TrendingUp, 
  X, 
  Check, 
  Edit, 
  ArrowDown, 
  ArrowUp, 
  Loader, 
  BellRing, 
  Coffee,
  Eye,
  Dumbbell,
  Pizza,
  List,
  PlusCircle,
  MinusCircle,
  Clock,
  CalendarDays,
  Sliders,
  Maximize2
} from 'lucide-react';
import { ChangeRecommendation, NutritionChange, WorkoutChange } from '../../types/progress';
import { useAdmin } from '../../contexts/AdminContext';
import { useMealPlan } from '../../contexts/MealPlanContext';
import { ClientProgramAdjuster } from './ClientProgramAdjuster';
import { getOverviewById } from '../../data/overview';

interface ChangeAlertCardProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  recommendation: ChangeRecommendation;
  onAccept: (recommendationId: string) => void;
  onReject: (recommendationId: string) => void;
  onOverride: (recommendationId: string) => void;
  onEditAndAccept?: (
    recommendationId: string, 
    nutritionChange?: NutritionChange, 
    workoutChange?: WorkoutChange
  ) => void;
}

export const ChangeAlertCard: React.FC<ChangeAlertCardProps> = ({
  user,
  recommendation,
  onAccept,
  onReject,
  onOverride,
  onEditAndAccept
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOverriding, setIsOverriding] = useState(false);
  const [overrideMessage, setOverrideMessage] = useState('');
  
  // New state for detailed editing
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [showMealPlanContext, setShowMealPlanContext] = useState(false);
  const [showWorkoutContext, setShowWorkoutContext] = useState(false);
  
  // For program adjuster
  const [showProgramAdjuster, setShowProgramAdjuster] = useState(false);
  
  // Editable nutrition change
  const [editedNutritionChange, setEditedNutritionChange] = useState<NutritionChange | undefined>(
    recommendation.nutritionChange ? { ...recommendation.nutritionChange } : undefined
  );
  
  // Editable workout change
  const [editedWorkoutChange, setEditedWorkoutChange] = useState<WorkoutChange | undefined>(
    recommendation.workoutChange ? { ...recommendation.workoutChange } : undefined
  );
  
  // Access context data for showing current meal plan and workouts
  const { getUserTrainingPlan } = useAdmin();
  const { getMealPlanForUser } = useMealPlan();
  
  // Get current meal plan and workout plan
  const userMealPlan = getMealPlanForUser(user.id);
  const userWorkoutPlan = getUserTrainingPlan(user.id);

  // Get appropriate icon and color based on status
  const getStatusDisplay = () => {
    if (recommendation.status.includes('התקדמות איטית') || recommendation.status.includes('פלטו')) {
      return {
        icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
        color: 'bg-amber-900/40 border-amber-700/50'
      };
    } else if (recommendation.status.includes('התקדמות טובה')) {
      return {
        icon: <TrendingUp className="h-5 w-5 text-green-400" />,
        color: 'bg-green-900/40 border-green-700/50'
      };
    } else if (recommendation.status.includes('סיכון') || recommendation.status.includes('אובדן')) {
      return {
        icon: <TrendingDown className="h-5 w-5 text-red-400" />,
        color: 'bg-red-900/40 border-red-700/50'
      };
    }
    return {
      icon: <Info className="h-5 w-5 text-blue-400" />,
      color: 'bg-blue-900/40 border-blue-700/50'
    };
  };

  const handleAccept = () => {
    setIsProcessing(true);
    onAccept(recommendation.id);
  };

  const handleReject = () => {
    onReject(recommendation.id);
  };

  const handleOverride = () => {
    if (isOverriding && overrideMessage) {
      onOverride(recommendation.id);
      setIsOverriding(false);
    } else {
      setIsOverriding(true);
    }
  };
  
  const handleDetailedEdit = () => {
    if (!isEditingDetails) {
      setIsEditingDetails(true);
    } else if (onEditAndAccept) {
      onEditAndAccept(
        recommendation.id,
        editedNutritionChange,
        editedWorkoutChange
      );
      setIsEditingDetails(false);
      setIsProcessing(true);
    }
  };
  
  // Helper function to adjust calorie change
  const adjustCalories = (amount: number) => {
    if (!editedNutritionChange) return;
    setEditedNutritionChange({
      ...editedNutritionChange,
      calorieChange: editedNutritionChange.calorieChange + amount
    });
  };
  
  // Helper function to toggle deload status
  const toggleDeload = () => {
    if (!editedWorkoutChange) return;
    setEditedWorkoutChange({
      ...editedWorkoutChange,
      deload: !editedWorkoutChange.deload
    });
  };
  
  // Helper function to change overload adjustment
  const changeOverloadAdjustment = (adjustment: 'increase' | 'decrease' | 'none') => {
    if (!editedWorkoutChange) return;
    setEditedWorkoutChange({
      ...editedWorkoutChange,
      overloadAdjustment: adjustment
    });
  };
  
  const { icon, color } = getStatusDisplay();
  
  return (
    <div className={`${color} rounded-lg p-5 mb-4 shadow-md border transition-all duration-300`} dir="rtl">
      <div className="flex items-start gap-4">
        {/* User info */}
        <div className="flex-shrink-0 relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 blur"></div>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 relative"
          />
          <div className="absolute -bottom-1 -right-1 p-1 bg-gradient-to-r from-red-600 to-amber-600 rounded-full animate-pulse">
            <BellRing className="h-4 w-4 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{user.name}</h3>
              <div className="px-2 py-1 rounded-full bg-gray-800/70 text-xs font-medium text-gray-300 border border-gray-700/50">
                {recommendation.goal === 'fat_loss' ? 'ירידה בשומן' : 
                 recommendation.goal === 'muscle_gain' ? 'בניית שריר' : 
                 'שיפור הרכב גוף'}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">רמת ביטחון:</span>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                recommendation.confidence === 'High' ? 'bg-green-800/70 text-green-200 border border-green-700/50' :
                recommendation.confidence === 'Medium' ? 'bg-amber-800/70 text-amber-200 border border-amber-700/50' :
                'bg-red-800/70 text-red-200 border border-red-700/50'
              }`}>
                {recommendation.confidence === 'High' ? 'גבוהה' :
                 recommendation.confidence === 'Medium' ? 'בינונית' :
                 'נמוכה'}
              </div>
            </div>
          </div>
          
          {/* Status */}
          <div className="flex items-center gap-2 mb-4 bg-black/20 p-3 rounded-lg border border-gray-700/50">
            {icon}
            <span className="font-medium text-white">{recommendation.status}</span>
          </div>
          
          {/* Changes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {recommendation.nutritionChange && (
              <div className="bg-black/20 p-3 rounded-lg border border-gray-700/50 hover:border-purple-700/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {recommendation.nutritionChange.calorieChange > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-amber-400" />
                    )}
                    <span className="font-medium text-white">שינוי בתזונה</span>
                  </div>
                  
                  {/* Button to view meal plan context */}
                  <button
                    onClick={() => setShowMealPlanContext(!showMealPlanContext)}
                    className="p-1.5 bg-blue-900/70 hover:bg-blue-800 rounded-lg text-blue-300 text-xs transition-colors duration-200 flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>צפה בתפריט</span>
                  </button>
                </div>
                
                {isEditingDetails ? (
                  // Editable Nutrition Change
                  <div className="space-y-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">התאמת קלוריות:</label>
                      <div className="flex items-center">
                        <button 
                          onClick={() => adjustCalories(-50)}
                          className="p-1.5 bg-red-900/70 text-white rounded-l-lg border border-red-700/50"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </button>
                        <input 
                          type="number"
                          value={editedNutritionChange?.calorieChange || 0} 
                          onChange={(e) => setEditedNutritionChange({
                            ...editedNutritionChange!,
                            calorieChange: parseInt(e.target.value)
                          })}
                          className="w-24 text-center py-1.5 bg-gray-800 border-t border-b border-gray-700 text-white"
                        />
                        <button 
                          onClick={() => adjustCalories(50)}
                          className="p-1.5 bg-green-900/70 text-white rounded-r-lg border border-green-700/50"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">סיבה לשינוי:</label>
                      <input
                        type="text"
                        value={editedNutritionChange?.reason || ''}
                        onChange={(e) => setEditedNutritionChange({
                          ...editedNutritionChange!,
                          reason: e.target.value
                        })}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                        placeholder="הסבר את הסיבה לשינוי התזונתי..."
                      />
                    </div>
                  </div>
                ) : (
                  // View-only Nutrition Change
                  <>
                    <p className="text-gray-300 text-sm">
                      {recommendation.nutritionChange.calorieChange > 0 
                        ? `הגדלת קלוריות ב-${recommendation.nutritionChange.calorieChange}` 
                        : `הפחתת קלוריות ב-${Math.abs(recommendation.nutritionChange.calorieChange)}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{recommendation.nutritionChange.reason}</p>
                  </>
                )}
              </div>
            )}
            
            {recommendation.workoutChange && (
              <div className="bg-black/20 p-3 rounded-lg border border-gray-700/50 hover:border-blue-700/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <span className="font-medium text-white">שינוי באימון</span>
                  </div>
                  
                  {/* Button to view workout context */}
                  <button
                    onClick={() => setShowWorkoutContext(!showWorkoutContext)}
                    className="p-1.5 bg-blue-900/70 hover:bg-blue-800 rounded-lg text-blue-300 text-xs transition-colors duration-200 flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>צפה באימון</span>
                  </button>
                </div>
                
                {isEditingDetails ? (
                  // Editable Workout Change
                  <div className="space-y-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">התאמת עומס:</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => changeOverloadAdjustment('increase')}
                          className={`flex-1 py-1 px-2 rounded text-sm font-medium flex justify-center items-center gap-1 
                            ${editedWorkoutChange?.overloadAdjustment === 'increase' 
                              ? 'bg-green-900 text-green-200 border border-green-700' 
                              : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
                        >
                          <ArrowUp className="h-3 w-3" />
                          <span>הגדלה</span>
                        </button>
                        <button 
                          onClick={() => changeOverloadAdjustment('none')}
                          className={`flex-1 py-1 px-2 rounded text-sm font-medium
                            ${editedWorkoutChange?.overloadAdjustment === 'none' 
                              ? 'bg-gray-700 text-white border border-gray-600' 
                              : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
                        >
                          <span>אין שינוי</span>
                        </button>
                        <button 
                          onClick={() => changeOverloadAdjustment('decrease')}
                          className={`flex-1 py-1 px-2 rounded text-sm font-medium flex justify-center items-center gap-1
                            ${editedWorkoutChange?.overloadAdjustment === 'decrease' 
                              ? 'bg-amber-900 text-amber-200 border border-amber-700' 
                              : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
                        >
                          <ArrowDown className="h-3 w-3" />
                          <span>הפחתה</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <input
                          type="checkbox"
                          checked={editedWorkoutChange?.deload || false}
                          onChange={toggleDeload}
                          className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                        />
                        <span>שבוע דילואד (הפחתת עומס)</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">סיבה לשינוי:</label>
                      <input
                        type="text"
                        value={editedWorkoutChange?.reason || ''}
                        onChange={(e) => setEditedWorkoutChange({
                          ...editedWorkoutChange!,
                          reason: e.target.value
                        })}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                        placeholder="הסבר את הסיבה לשינוי האימון..."
                      />
                    </div>
                  </div>
                ) : (
                  // View-only Workout Change
                  <>
                    {recommendation.workoutChange.overloadAdjustment !== 'none' && (
                      <p className="text-gray-300 text-sm">
                        {recommendation.workoutChange.overloadAdjustment === 'increase'
                          ? 'הגדלת עומס האימון'
                          : 'הפחתת עומס האימון'}
                      </p>
                    )}
                    {recommendation.workoutChange.deload && (
                      <p className="text-gray-300 text-sm">
                        מומלץ שבוע הפחתת עומס
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{recommendation.workoutChange.reason}</p>
                  </>
                )}
              </div>
            )}
          </div>
            
          {/* User message */}
          <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-700/40 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Info className="h-4 w-4 text-purple-400" />
              <span className="font-medium text-white">הודעה למתאמן</span>
            </div>
            <p className="text-gray-300 text-sm">{recommendation.userMessage}</p>
          </div>

          {/* Override input */}
          {isOverriding && (
            <div className="mb-4">
              <div className="bg-gray-800 rounded-lg p-3 border border-purple-700">
                <label className="block text-sm font-medium text-gray-200 mb-2">הודעה מותאמת אישית</label>
                <textarea
                  value={overrideMessage}
                  onChange={(e) => setOverrideMessage(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="הזן הודעה מותאמת אישית כדי לעקוף את המלצת המערכת..."
                />
              </div>
            </div>
          )}
          
          {/* Meal Plan Context */}
          {showMealPlanContext && userMealPlan && (
            <div className="mb-4 bg-gray-800/90 p-4 rounded-lg border border-blue-700/40 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-blue-300 flex items-center gap-2">
                  <Pizza className="h-4 w-4" />
                  <span>תוכנית תזונה נוכחית</span>
                </h4>
                <button 
                  onClick={() => setShowMealPlanContext(false)}
                  className="p-1 rounded-full hover:bg-gray-700/70 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pr-2">
                {userMealPlan.meals?.length ? (
                  <div className="space-y-2">
                    {userMealPlan.meals.map((meal, idx) => (
                      <div key={idx} className="p-2 bg-gray-900/80 rounded border border-gray-700/60">
                        <div className="font-medium text-sm text-white mb-1 flex items-center gap-1.5">
                          <Coffee className="h-3.5 w-3.5 text-blue-400" />
                          {meal.meal}
                        </div>
                        <div className="text-xs text-gray-400">
                          {meal.categories?.reduce((total, cat) => total + (cat.options?.length || 0), 0) || 0} פריטי מזון
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    אין תוכנית תזונה מוגדרת למתאמן
                  </div>
                )}
              </div>
              
              {userMealPlan.calorieAdjustment && (
                <div className="mt-2 p-2 bg-blue-900/20 rounded-lg text-xs text-blue-300 border border-blue-800/30">
                  <div className="flex items-center gap-1.5">
                    <Info className="h-3 w-3" />
                    <span>התאמת קלוריות קודמת: {userMealPlan.calorieAdjustment > 0 ? '+' : ''}{userMealPlan.calorieAdjustment} קלוריות</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Workout Context */}
          {showWorkoutContext && userWorkoutPlan && (
            <div className="mb-4 bg-gray-800/90 p-4 rounded-lg border border-blue-700/40 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-blue-300 flex items-center gap-2">
                  <Dumbbell className="h-4 w-4" />
                  <span>תוכנית אימונים נוכחית</span>
                </h4>
                <button 
                  onClick={() => setShowWorkoutContext(false)}
                  className="p-1 rounded-full hover:bg-gray-700/70 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pr-2">
                {userWorkoutPlan.length ? (
                  <div className="space-y-2">
                    {userWorkoutPlan.map((day, idx) => (
                      <div key={idx} className="p-2 bg-gray-900/80 rounded border border-gray-700/60">
                        <div className="font-medium text-sm text-white mb-1 flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-blue-400" />
                          {day.day} - {day.focus}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Dumbbell className="h-3 w-3" />
                          <span>{day.exercises.length} תרגילים</span>
                          <Clock className="h-3 w-3 ml-1" />
                          <span>~{day.exercises.length * 10} דקות</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    אין תוכנית אימונים מוגדרת למתאמן
                  </div>
                )}
              </div>
              
              <div className="mt-3 text-xs text-blue-300 flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                <span>לחץ על "התאמה מלאה" כדי לערוך את המלצות האימון</span>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            {/* New button to open full program adjuster */}
            <button
              onClick={() => setShowProgramAdjuster(true)}
              className="px-3 py-2 bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-lg flex items-center gap-2 transition-all duration-300 hover:from-purple-600 hover:to-purple-500 transform hover:scale-105 shadow-md border-b-2 border-purple-900"
            >
              <Maximize2 className="h-4 w-4" />
              <span>התאמה מלאה</span>
            </button>
            
            {/* Override button */}
            <button
              onClick={handleOverride}
              className={`px-3 py-2 ${
                isOverriding 
                  ? 'bg-purple-700 hover:bg-purple-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              } text-white rounded-lg text-sm flex items-center gap-1 transition-colors duration-200 shadow-md`}
            >
              <Edit className="h-4 w-4" />
              <span>{isOverriding ? 'שלח עדכון' : 'התאמה אישית'}</span>
            </button>
            
            {/* Reject button */}
            <button
              onClick={handleReject}
              className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm flex items-center gap-1 transition-colors duration-200 shadow-md"
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
              <span>דחה</span>
            </button>
            
            {/* Accept button */}
            <button
              onClick={handleAccept}
              className="px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-1 transition-colors duration-200 shadow-md"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>מעבד...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>אשר</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Program Adjuster Modal */}
      {showProgramAdjuster && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in-up backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl max-w-4xl w-full mx-4 shadow-2xl border-2 border-purple-500 overflow-hidden max-h-[90vh] flex flex-col">
            <ClientProgramAdjuster
              userId={user.id}
              onClose={() => setShowProgramAdjuster(false)}
              fromAlert={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};