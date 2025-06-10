import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Dumbbell, 
  Pizza, 
  Info, 
  ArrowUp, 
  ArrowDown, 
  Target, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit,
  Sliders,
  UserCheck
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressTrackingContext';
import { useMealPlan } from '../../contexts/MealPlanContext';
import { useAdmin } from '../../contexts/AdminContext';
import { getOverviewById } from '../../data/overview';
import { ProgressData, NutritionChange, WorkoutChange } from '../../types/progress';
import { parseRepsRange, parseSetsValue } from '../../utils/workoutUtils';

interface ClientProgramAdjusterProps {
  userId: string;
  onClose: () => void;
  fromAlert?: boolean;
}

export const ClientProgramAdjuster: React.FC<ClientProgramAdjusterProps> = ({ 
  userId, 
  onClose,
  fromAlert = false
}) => {
  // Get user overview data
  const userOverview = getOverviewById(userId);
  
  // Check if userOverview exists - early return if it doesn't
  if (!userOverview) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4 bg-red-900/30 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">לא נמצאו נתוני משתמש</h3>
        <p className="text-gray-400 mb-6">לא ניתן למצוא את נתוני המשתמש המבוקש</p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-purple-700 text-white rounded-xl shadow-lg hover:bg-purple-600 transition-all duration-200"
        >
          סגור
        </button>
      </div>
    );
  }

  // Contexts
  const { updateUserProgress, recommendations } = useProgress();
  const { applyCalorieAdjustment, getMealPlanForUser } = useMealPlan();
  const { getUserTrainingPlan, updateTrainingPlan } = useAdmin();
  
  // Get current meal plan and workout plan
  const mealPlan = getMealPlanForUser(userId);
  const workoutPlan = getUserTrainingPlan(userId);

  // Get any active recommendation for this user
  const userRecommendation = Object.values(recommendations).find(rec => rec.userId === userId);
  
  // State for the form
  const [formData, setFormData] = useState<{
    goal: 'fat_loss' | 'muscle_gain';
    weeklyWeightTarget: number;
    calorieChange: number;
    workloadChange: 'none' | 'increase' | 'decrease';
    deloadWeek: boolean;
    exerciseRestPeriods: 'normal' | 'short' | 'extended';
    macroRatio: 'balanced' | 'high_protein' | 'low_carb' | 'high_carb';
    adjustmentNote: string;
  }>({
    goal: userOverview.goal,
    weeklyWeightTarget: userOverview.goal === 'fat_loss' ? -0.5 : 0.3,
    calorieChange: userRecommendation?.nutritionChange?.calorieChange || 0,
    workloadChange: userRecommendation?.workoutChange?.overloadAdjustment || 'none',
    deloadWeek: userRecommendation?.workoutChange?.deload || false,
    exerciseRestPeriods: 'normal',
    macroRatio: 'balanced',
    adjustmentNote: userRecommendation?.userMessage || ''
  });

  // Success message state
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Handle form submission
  const handleSubmit = () => {
    // Create nutrition change
    const nutritionChange: NutritionChange = {
      calorieChange: formData.calorieChange,
      reason: `התאמת תוכנית עבור ${userOverview.userName} - ${
        formData.calorieChange > 0 
          ? 'הגדלת קלוריות לתמיכה בבניית שריר' 
          : 'הפחתת קלוריות לסיוע בירידה בשומן'
      }`,
      macroAdjustments: getMacroAdjustments(formData.macroRatio)
    };
    
    // Create workout change
    const workoutChange: WorkoutChange = {
      overloadAdjustment: formData.workloadChange,
      deload: formData.deloadWeek,
      reason: `התאמת עומס אימונים ${
        formData.workloadChange === 'increase' 
          ? 'להגדלת האתגר ושיפור בניית שריר' 
          : formData.workloadChange === 'decrease'
          ? 'להפחתת עומס ומניעת אימון יתר'
          : 'ללא שינוי בעומס'
      }${formData.deloadWeek ? ', כולל שבוע דילואד להתאוששות' : ''}`,
    };
    
    // Apply calorie adjustment
    if (formData.calorieChange !== 0) {
      applyCalorieAdjustment(userId, formData.calorieChange);
    }
    
    // Apply workout adjustment
    if (formData.workloadChange !== 'none' || formData.deloadWeek) {
      applyWorkoutAdjustments(workoutPlan, formData.workloadChange, formData.deloadWeek, formData.exerciseRestPeriods);
    }
    
    // Update progress data with adjustment info
    updateUserProgress(userId, {
      lastAdjustmentDate: new Date(),
      nutritionAdjustment: formData.calorieChange,
      workoutAdjustment: formData.workloadChange,
      weeklyTarget: formData.weeklyWeightTarget
    });
    
    // Show success message
    setShowSuccess(true);
    
    // Close after a delay
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };
  
  // Helper to get macro adjustments based on selected ratio
  const getMacroAdjustments = (ratio: string) => {
    switch(ratio) {
      case 'high_protein':
        return { protein: 15, carbs: -10, fats: -5 };
      case 'low_carb':
        return { protein: 5, carbs: -20, fats: 15 };
      case 'high_carb':
        return { protein: -5, carbs: 15, fats: -10 };
      default:
        return undefined; // balanced - no changes
    }
  };
  
  // Apply workout adjustments
  const applyWorkoutAdjustments = (
    currentPlan: any[],
    adjustmentType: 'none' | 'increase' | 'decrease',
    deload: boolean,
    restPeriods: string
  ) => {
    // Skip if no plan exists
    if (!currentPlan || !currentPlan.length) return;
    
    // Clone the plan to avoid mutations
    const newPlan = JSON.parse(JSON.stringify(currentPlan));
    
    // Calculate rest period multiplier
    const restMultiplier = restPeriods === 'short' ? 0.8 : 
                          restPeriods === 'extended' ? 1.5 : 1;
    
    // Apply adjustments to each day
    const adjustedPlan = newPlan.map((day: any) => {
      return {
        ...day,
        exercises: day.exercises.map((exercise: any) => {
          // Parse current values
          const currentSets = parseSetsValue(exercise.sets);
          const [minReps, maxReps] = parseRepsRange(exercise.reps);
          const restValue = parseInt(exercise.rest.replace(' seconds rest', ''));
          
          // Apply adjustments based on type
          if (deload) {
            // Deload reduces volume but keeps intensity
            return {
              ...exercise,
              sets: `${Math.max(2, Math.floor(currentSets * 0.7))} sets`,
              reps: `${Math.floor(minReps * 0.9)}-${Math.floor(maxReps * 0.9)} reps`,
              rest: `${Math.round(restValue * 1.2)} seconds rest` // More rest during deload
            };
          } else if (adjustmentType === 'increase') {
            // Progressive overload - increase sets or reps
            return {
              ...exercise,
              sets: `${currentSets + 1} sets`,
              reps: `${minReps}-${maxReps + 2} reps`,
              rest: `${Math.round(restValue * restMultiplier)} seconds rest`
            };
          } else if (adjustmentType === 'decrease') {
            // Reduce volume temporarily
            return {
              ...exercise,
              sets: `${Math.max(2, currentSets - 1)} sets`,
              reps: `${Math.max(6, minReps - 2)}-${maxReps} reps`,
              rest: `${Math.round(restValue * restMultiplier)} seconds rest`
            };
          }
          
          // Only adjust rest periods if no other changes
          if (restPeriods !== 'normal') {
            return {
              ...exercise,
              rest: `${Math.round(restValue * restMultiplier)} seconds rest`
            };
          }
          
          return exercise;
        })
      };
    });
    
    // Update the training plan
    updateTrainingPlan(userId, adjustedPlan);
  };
  
  return (
    <>
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-purple-700 p-4 flex items-center justify-between shadow-md border-b border-purple-600">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-900 rounded-lg shadow-md">
              <Sliders className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">התאמת תוכנית אימון ותזונה</h2>
              <p className="text-sm text-purple-200">{userOverview.userName} - שינויי תוכנית מותאמים אישית</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-purple-600/50 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {showSuccess ? (
            <div className="bg-green-800 rounded-xl p-5 shadow-lg border border-green-700 text-center">
              <div className="p-3 bg-green-700 rounded-full mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ההתאמות נשמרו בהצלחה!</h3>
              <p className="text-green-200 mb-4">התוכנית עבור {userOverview.userName} עודכנה</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-700/40 shadow-md">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-blue-200">
                      התאם את תוכנית המתאמן לפי צרכיו הספציפיים. שינויים אלו יתעדכנו בתוכנית התזונה והאימונים באופן מיידי.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <UserCheck className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-300">יעד נוכחי: {userOverview.goal === 'fat_loss' ? 'ירידה בשומן' : 'בניית שריר'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-300">משקל נוכחי: {userOverview.currentWeight} ק"ג</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Goals Section */}
              <div className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:border-purple-600/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4 border-b border-gray-700 pb-3">
                  <Target className="h-5 w-5 text-purple-400" />
                  <span>יעדים והתקדמות</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Goal Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">יעד נוכחי:</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, goal: 'fat_loss', weeklyWeightTarget: -0.5})}
                        className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 border-2 ${
                          formData.goal === 'fat_loss'
                            ? 'bg-blue-900 text-white border-blue-600'
                            : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-blue-600/50'
                        } transition-all duration-200`}
                      >
                        <ArrowDown className="h-5 w-5" />
                        <span>ירידה בשומן</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, goal: 'muscle_gain', weeklyWeightTarget: 0.3})}
                        className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 border-2 ${
                          formData.goal === 'muscle_gain'
                            ? 'bg-green-900 text-white border-green-600'
                            : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-green-600/50'
                        } transition-all duration-200`}
                      >
                        <ArrowUp className="h-5 w-5" />
                        <span>בניית שריר</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Weekly Target */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">יעד שבועי (ק"ג):</label>
                    <div className="relative">
                      <input 
                        type="number"
                        step="0.1"
                        value={formData.weeklyWeightTarget}
                        onChange={(e) => setFormData({...formData, weeklyWeightTarget: parseFloat(e.target.value)})}
                        className="w-full p-3 border-2 border-gray-700 bg-gray-700/70 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                      />
                      <div className="absolute top-3 right-3 bg-gray-800 rounded-lg px-2 py-1 text-sm text-gray-300 border border-gray-600">
                        ק"ג / שבוע
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-400 flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" />
                      <span>
                        {formData.goal === 'fat_loss'
                          ? 'מומלץ: -0.5 עד -1 ק"ג בשבוע'
                          : 'מומלץ: 0.2 עד 0.5 ק"ג בשבוע'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Nutrition Section */}
              <div className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:border-purple-600/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4 border-b border-gray-700 pb-3">
                  <Pizza className="h-5 w-5 text-purple-400" />
                  <span>התאמות תזונה</span>
                </h3>
                
                {/* Current calorie adjustment */}
                {mealPlan?.calorieAdjustment && (
                  <div className="mb-4 bg-blue-900/30 rounded-lg p-3 border border-blue-700/40 text-sm">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <span className="text-blue-200">
                        התאמת קלוריות קיימת: {mealPlan.calorieAdjustment > 0 ? '+' : ''}{mealPlan.calorieAdjustment} קלוריות
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Calorie Adjustment */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">התאמת קלוריות:</label>
                    
                    <div className="grid grid-cols-5 gap-2">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, calorieChange: -500})}
                        className={`py-2 px-4 rounded-lg text-center ${formData.calorieChange === -500 ? 'bg-red-900 text-white border-2 border-red-600' : 'bg-gray-700 text-gray-300'}`}
                      >-500</button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, calorieChange: -250})}
                        className={`py-2 px-4 rounded-lg text-center ${formData.calorieChange === -250 ? 'bg-red-900 text-white border-2 border-red-600' : 'bg-gray-700 text-gray-300'}`}
                      >-250</button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, calorieChange: 0})}
                        className={`py-2 px-4 rounded-lg text-center ${formData.calorieChange === 0 ? 'bg-gray-600 text-white border-2 border-gray-500' : 'bg-gray-700 text-gray-300'}`}
                      >0</button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, calorieChange: 250})}
                        className={`py-2 px-4 rounded-lg text-center ${formData.calorieChange === 250 ? 'bg-green-900 text-white border-2 border-green-600' : 'bg-gray-700 text-gray-300'}`}
                      >+250</button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, calorieChange: 500})}
                        className={`py-2 px-4 rounded-lg text-center ${formData.calorieChange === 500 ? 'bg-green-900 text-white border-2 border-green-600' : 'bg-gray-700 text-gray-300'}`}
                      >+500</button>
                    </div>
                    
                    <div className="mt-2">
                      <input
                        type="range"
                        min={-500}
                        max={500}
                        step={50}
                        value={formData.calorieChange}
                        onChange={(e) => setFormData({...formData, calorieChange: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>-500</span>
                        <span>-250</span>
                        <span>0</span>
                        <span>+250</span>
                        <span>+500</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Macro Ratio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">יחס מאקרו:</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, macroRatio: 'balanced'})}
                        className={`py-2 px-3 rounded-lg text-center text-sm ${formData.macroRatio === 'balanced' ? 'bg-purple-900 text-white border-2 border-purple-600' : 'bg-gray-700 text-gray-300 border-2 border-gray-600'}`}
                      >מאוזן</button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, macroRatio: 'high_protein'})}
                        className={`py-2 px-3 rounded-lg text-center text-sm ${formData.macroRatio === 'high_protein' ? 'bg-blue-900 text-white border-2 border-blue-600' : 'bg-gray-700 text-gray-300 border-2 border-gray-600'}`}
                      >עתיר חלבון</button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, macroRatio: 'low_carb'})}
                        className={`py-2 px-3 rounded-lg text-center text-sm ${formData.macroRatio === 'low_carb' ? 'bg-green-900 text-white border-2 border-green-600' : 'bg-gray-700 text-gray-300 border-2 border-gray-600'}`}
                      >דל פחמימות</button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, macroRatio: 'high_carb'})}
                        className={`py-2 px-3 rounded-lg text-center text-sm ${formData.macroRatio === 'high_carb' ? 'bg-amber-900 text-white border-2 border-amber-600' : 'bg-gray-700 text-gray-300 border-2 border-gray-600'}`}
                      >עתיר פחמימות</button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Workout Section */}
              <div className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:border-purple-600/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4 border-b border-gray-700 pb-3">
                  <Dumbbell className="h-5 w-5 text-purple-400" />
                  <span>התאמות אימון</span>
                </h3>
                
                {/* Workload Change */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">שינוי עומס אימונים:</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, workloadChange: 'increase'})}
                        className={`py-2.5 px-4 rounded-lg text-center flex-1 flex items-center justify-center gap-2 ${formData.workloadChange === 'increase' ? 'bg-green-900 text-white border-2 border-green-600' : 'bg-gray-700 text-gray-300 border-2 border-gray-600'}`}
                      >
                        <ArrowUp className="h-4 w-4" />
                        <span>הגדלה</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, workloadChange: 'none'})}
                        className={`py-2.5 px-4 rounded-lg text-center flex-1 ${formData.workloadChange === 'none' ? 'bg-gray-600 text-white border-2 border-gray-500' : 'bg-gray-700 text-gray-300 border-2 border-gray-600'}`}
                      >
                        אין שינוי
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, workloadChange: 'decrease'})}
                        className={`py-2.5 px-4 rounded-lg text-center flex-1 flex items-center justify-center gap-2 ${formData.workloadChange === 'decrease' ? 'bg-amber-900 text-white border-2 border-amber-600' : 'bg-gray-700 text-gray-300 border-2 border-gray-600'}`}
                      >
                        <ArrowDown className="h-4 w-4" />
                        <span>הפחתה</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Deload Week */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="deloadWeek"
                      checked={formData.deloadWeek}
                      onChange={() => setFormData({...formData, deloadWeek: !formData.deloadWeek})}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="deloadWeek" className="ms-2 text-sm font-medium text-gray-300 cursor-pointer">
                      שבוע דילואד (הפחתת עומס להתאוששות)
                    </label>
                  </div>
                  
                  {/* Rest Periods */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">זמני מנוחה בין סטים:</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, exerciseRestPeriods: 'short'})}
                        className={`py-2.5 px-4 rounded-lg text-center ${formData.exerciseRestPeriods === 'short' ? 'bg-amber-900 text-white border-2 border-amber-600' : 'bg-gray-700 text-gray-300 border-2 border-gray-600'}`}
                      >
                        קצרים
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, exerciseRestPeriods: 'normal'})}
                        className={`py-2.5 px-4 rounded-lg text-center ${formData.exerciseRestPeriods === 'normal' ? 'bg-blue-900 text-white border-2 border-blue-600' : 'bg-gray-700 text-gray-300 border-2 border-gray-600'}`}
                      >
                        רגילים
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, exerciseRestPeriods: 'extended'})}
                        className={`py-2.5 px-4 rounded-lg text-center ${formData.exerciseRestPeriods === 'extended' ? 'bg-green-900 text-white border-2 border-green-600' : 'bg-gray-700 text-gray-300 border-2 border-gray-600'}`}
                      >
                        ארוכים
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-400 flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" />
                      <span>
                        {formData.exerciseRestPeriods === 'short'
                          ? 'מנוחה קצרה יותר עבור אימון מטבולי יותר ושריפת קלוריות'
                          : formData.exerciseRestPeriods === 'extended'
                          ? 'מנוחה ארוכה יותר לשיפור כוח ואימון עם משקלים כבדים'
                          : 'מנוחה רגילה לאיזון בין כוח והיפרטרופיה'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Notes Section */}
              <div className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:border-purple-600/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4 border-b border-gray-700 pb-3">
                  <Edit className="h-5 w-5 text-purple-400" />
                  <span>הערות לשינויים</span>
                </h3>
                
                <div>
                  <textarea
                    value={formData.adjustmentNote}
                    onChange={(e) => setFormData({...formData, adjustmentNote: e.target.value})}
                    placeholder="הכנס הערות או הסברים למתאמן לגבי השינויים..."
                    rows={4}
                    className="w-full p-3 border-2 border-gray-700 bg-gray-700/70 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-400 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5" />
                    <span>הערות אלה יוצגו למתאמן בכרטיסיית ההתקדמות</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with Actions */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-t border-gray-700 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-300 hover:text-gray-100 hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium"
          >
            ביטול
          </button>
          <button
            onClick={handleSubmit}
            disabled={showSuccess}
            className="px-5 py-2.5 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-500 transition-all duration-300 font-medium shadow-md border-b-2 border-green-800 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            <span>שמור התאמות</span>
          </button>
        </div>
      </div>
    </>
  );
};