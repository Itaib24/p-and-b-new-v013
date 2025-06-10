import React, { useState, useEffect } from 'react';
import { trainingPlan } from '../../data/trainingPlan';
import { Dumbbell, Timer, ChevronRight, SkipForward, Play, Square, FastForward, CheckCircle, HelpCircle, Info } from 'lucide-react';
import { useWorkout } from '../../contexts/WorkoutContext';
import { useWorkoutLog } from '../../contexts/WorkoutLogContext';
import { WorkoutLog } from '../../types/workout';
import { useAdmin } from '../../contexts/AdminContext';
import { useProgress } from '../../contexts/ProgressTrackingContext';
import { getLastWeightForExercise, calculateRecommendedWeight } from '../../utils/workoutUtils';

interface WorkoutLoggerProps {
  userId: string;
  onWorkoutStart: () => void;
  onWorkoutEnd: () => void;
  onRestStart: (duration: number) => void;
  onPauseToggle: (paused: boolean) => void;
  restTimer: number;
  isPaused: boolean;
}

interface ExerciseLog {
  name: string;
  sets: { weight: number; reps: number }[];
}

export const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({
  userId,
  onWorkoutStart,
  onWorkoutEnd,
  onRestStart,
  onPauseToggle,
  restTimer,
  isPaused
}) => {
  const {
    isWorkoutStarted,
    setIsWorkoutStarted,
    selectedDay,
    setSelectedDay,
    currentExerciseIndex,
    setCurrentExerciseIndex,
    activeExercise,
    setActiveExercise,
    weight,
    setWeight,
    reps,
    setReps
  } = useWorkout();

  const { addWorkoutLog, getWorkoutLogs } = useWorkoutLog();
  const { getUserTrainingPlan } = useAdmin();
  const { recommendations } = useProgress();
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [showControlsHelp, setShowControlsHelp] = useState(false);

  // Get user's training plan
  const userTrainingPlan = getUserTrainingPlan(userId);
  // Get user's workout logs
  const workoutLogs = getWorkoutLogs(userId);
  
  // Get any active workout recommendation for this user
  const activeWorkoutRecommendation = Object.values(recommendations)
    .find(rec => rec.userId === userId && rec.workoutChange)?.workoutChange;

  const startWorkout = () => {
    const workout = userTrainingPlan.find(day => day.day === selectedDay);
    if (workout) {
      const firstExercise = workout.exercises[0];
      const sets = Array(parseInt(firstExercise.sets)).fill({
        weight: 0,
        reps: 0,
        completed: false
      });
      
      setActiveExercise({
        name: firstExercise.name,
        sets,
        currentSet: 0,
        rest: firstExercise.rest,
        instructions: firstExercise.instructions,
        targetReps: firstExercise.reps
      });
      
      setCurrentExerciseIndex(0);
      setIsWorkoutStarted(true);
      setExerciseLogs([]);
      onWorkoutStart();
    }
  };

  const skipExercise = () => {
    const workout = userTrainingPlan.find(day => day.day === selectedDay);
    if (!workout || currentExerciseIndex >= workout.exercises.length - 1) return;

    // Save current exercise logs if any sets were completed
    if (activeExercise && activeExercise.currentSet > 0) {
      const completedSets = activeExercise.sets
        .slice(0, activeExercise.currentSet)
        .map(set => ({
          weight: set.weight,
          reps: set.reps
        }));

      setExerciseLogs(prev => [...prev, {
        name: activeExercise.name,
        sets: completedSets
      }]);
    }

    const nextExercise = workout.exercises[currentExerciseIndex + 1];
    const sets = Array(parseInt(nextExercise.sets)).fill({
      weight: 0,
      reps: 0,
      completed: false
    });
    
    setActiveExercise({
      name: nextExercise.name,
      sets,
      currentSet: 0,
      rest: nextExercise.rest,
      instructions: nextExercise.instructions,
      targetReps: nextExercise.reps
    });
    
    setCurrentExerciseIndex(prev => prev + 1);
    onRestStart(0);
    setWeight('');
    setReps('');
  };

  const skipRest = () => {
    onRestStart(0);
  };

  const handleFinishWorkoutClick = () => {
    // Save current exercise if any sets were completed
    if (activeExercise && activeExercise.currentSet > 0) {
      const completedSets = activeExercise.sets
        .slice(0, activeExercise.currentSet)
        .map(set => ({
          weight: set.weight,
          reps: set.reps
        }));

      setExerciseLogs(prev => [...prev, {
        name: activeExercise.name,
        sets: completedSets
      }]);
    }
    setShowFinishConfirmation(true);
  };

  const confirmFinishWorkout = () => {
    const workout = userTrainingPlan.find(day => day.day === selectedDay);
    
    if (workout && exerciseLogs.length > 0) {
      const workoutLog: WorkoutLog = {
        date: new Date().toISOString().split('T')[0],
        type: workout.focus,
        duration: '60 min',
        exercises: exerciseLogs
      };

      // Add to context
      addWorkoutLog(userId, workoutLog);
    }

    setIsWorkoutStarted(false);
    setActiveExercise(null);
    setCurrentExerciseIndex(0);
    setWeight('');
    setReps('');
    setExerciseLogs([]);
    setShowFinishConfirmation(false);
    onWorkoutEnd();
  };

  const completeSet = () => {
    if (!activeExercise || !weight || !reps) return;

    const workout = userTrainingPlan.find(day => day.day === selectedDay);
    if (!workout) return;

    const currentWeight = parseFloat(weight);
    const currentReps = parseInt(reps);

    const newSets = [...activeExercise.sets];
    newSets[activeExercise.currentSet] = {
      weight: currentWeight,
      reps: currentReps,
      completed: true
    };

    // Start rest timer
    const restTime = parseInt(activeExercise.rest) || 60;
    onRestStart(restTime);

    // Clear input fields
    setWeight('');
    setReps('');

    if (activeExercise.currentSet === activeExercise.sets.length - 1) {
      // Save completed exercise
      const completedSets = newSets.map(set => ({
        weight: set.weight,
        reps: set.reps
      }));

      setExerciseLogs(prev => [...prev, {
        name: activeExercise.name,
        sets: completedSets
      }]);

      // Move to next exercise
      if (currentExerciseIndex < workout.exercises.length - 1) {
        const nextExercise = workout.exercises[currentExerciseIndex + 1];
        const sets = Array(parseInt(nextExercise.sets)).fill({
          weight: 0,
          reps: 0,
          completed: false
        });
        
        setActiveExercise({
          name: nextExercise.name,
          sets,
          currentSet: 0,
          rest: nextExercise.rest,
          instructions: nextExercise.instructions,
          targetReps: nextExercise.reps
        });
        
        setCurrentExerciseIndex(prev => prev + 1);
      } else {
        // Workout completed
        handleFinishWorkoutClick();
      }
    } else {
      // Move to next set
      setActiveExercise({
        ...activeExercise,
        sets: newSets,
        currentSet: activeExercise.currentSet + 1
      });
    }
  };

  // Get the last weight used for the current exercise
  const getLastWeight = (): number | null => {
    if (!activeExercise) return null;
    return getLastWeightForExercise(workoutLogs, activeExercise.name);
  };

  // Get recommended weight based on the last weight and progress recommendation
  const getRecommendedWeight = (): number | null => {
    const lastWeight = getLastWeight();
    if (lastWeight === null) return null;
    
    // Use active workout recommendation if available
    const overloadAdjustment = activeWorkoutRecommendation?.overloadAdjustment;
    
    return calculateRecommendedWeight(lastWeight, overloadAdjustment);
  };

  const lastWeight = getLastWeight();
  const recommendedWeight = getRecommendedWeight();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isWorkoutStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6\" dir="rtl">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-purple-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-purple-800 transform hover:rotate-12 transition-transform duration-300">
              <Dumbbell className="h-6 w-6 text-purple-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-200">רישום אימון</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">בחר יום אימון</label>
              <select
                className="w-full p-2 border-2 border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:border-purple-600 focus:ring focus:ring-purple-600 focus:ring-opacity-50"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                <option value="">בחר יום</option>
                {userTrainingPlan.map((day, index) => (
                  <option key={index} value={day.day}>
                    {day.day} - {day.focus}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={startWorkout}
              disabled={!selectedDay}
              className="w-full px-4 py-2 bg-purple-700 text-gray-200 rounded-lg hover:bg-purple-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              התחל אימון
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeExercise) return null;

  const workout = userTrainingPlan.find(day => day.day === selectedDay);
  const remainingSets = activeExercise.sets.length - activeExercise.currentSet;
  const remainingExercises = workout ? workout.exercises.length - currentExerciseIndex - 1 : 0;
  const targetRepsRange = activeExercise.targetReps.split('-').map(Number);

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-purple-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-800 transform hover:rotate-12 transition-transform duration-300">
              <Dumbbell className="h-6 w-6 text-purple-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-200">{selectedDay}</h2>
          </div>
          {restTimer > 0 && (
            <div className="flex items-center gap-4">
              <button
                onClick={skipRest}
                className="flex items-center gap-2 bg-amber-800 px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200 border border-amber-700"
              >
                <FastForward className="h-5 w-5 text-amber-300" />
                <span className="font-medium text-amber-200">דלג על מנוחה</span>
              </button>
              <div className="flex items-center gap-2 bg-amber-800 px-4 py-2 rounded-lg border border-amber-700">
                <Timer className="h-5 w-5 text-amber-300" />
                <span className="font-medium text-amber-200">
                  מנוחה: {formatTime(restTimer)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Controls Help */}
          <div className="bg-gray-800 rounded-lg p-4 relative border border-gray-700">
            <button
              onClick={() => setShowControlsHelp(!showControlsHelp)}
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-purple-900 transition-colors duration-200"
              title="עזרה"
            >
              <HelpCircle className="h-5 w-5 text-purple-400" />
            </button>
            {showControlsHelp && (
              <div className="space-y-3 mt-2">
                <h4 className="font-medium text-purple-300">כפתורי שליטה:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <Square className="h-4 w-4 text-gray-400" /> השהה אימון - עוצר את טיימר המנוחה ומאפשר הפסקה
                  </li>
                  <li className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-green-400" /> המשך אימון - ממשיך את האימון לאחר השהייה
                  </li>
                  <li className="flex items-center gap-2">
                    <SkipForward className="h-4 w-4 text-purple-400" /> דלג על תרגיל - עבור לתרגיל הבא
                  </li>
                  <li className="flex items-center gap-2">
                    <FastForward className="h-4 w-4 text-amber-400" /> דלג על מנוחה - מסיים את זמן המנוחה הנוכחי
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-400" /> סיים אימון - משלים את האימון הנוכחי
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Current Exercise */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-200">
                {activeExercise.name}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPauseToggle(!isPaused)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isPaused 
                      ? 'bg-green-800 hover:bg-green-700 text-green-300 border border-green-700'
                      : 'bg-amber-800 hover:bg-amber-700 text-amber-300 border border-amber-700'
                  }`}
                  title={isPaused ? 'המשך אימון' : 'השהה אימון'}
                >
                  {isPaused ? <Play className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                </button>
                <button
                  onClick={skipExercise}
                  className="p-2 bg-purple-800 rounded-lg hover:bg-purple-700 transition-colors duration-200 border border-purple-700"
                  title="דלג על תרגיל"
                >
                  <SkipForward className="h-5 w-5 text-purple-300" />
                </button>
                <button
                  onClick={handleFinishWorkoutClick}
                  className="p-2 bg-red-800 rounded-lg hover:bg-red-700 transition-colors duration-200 border border-red-700"
                  title="סיים אימון"
                >
                  <CheckCircle className="h-5 w-5 text-red-300" />
                </button>
              </div>
            </div>

            {/* Finish Workout Confirmation Dialog */}
            {showFinishConfirmation && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border-2 border-purple-700">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">האם אתה בטוח שברצונך לסיים את האימון?</h3>
                  <p className="text-gray-400 mb-6">לא ניתן לשחזר את ההתקדמות לאחר סיום האימון.</p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowFinishConfirmation(false)}
                      className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                    >
                      ביטול
                    </button>
                    <button
                      onClick={confirmFinishWorkout}
                      className="px-4 py-2 bg-red-700 text-gray-200 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      סיים אימון
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeExercise.currentSet === 0 && activeExercise.instructions && (
              <div className="mb-4 p-4 bg-amber-900/40 rounded-lg text-amber-200 border border-amber-800/50">
                {activeExercise.instructions}
              </div>
            )}

            {/* Last Weight and Recommended Weight Section */}
            {(lastWeight || recommendedWeight) && (
              <div className="mb-4 p-4 bg-blue-900/20 rounded-lg border border-blue-800/50">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-300 mb-2">מידע עבור {activeExercise.name}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {lastWeight !== null && (
                        <div className="bg-gray-800/60 p-3 rounded-lg">
                          <div className="text-sm text-blue-400 mb-1">משקל אחרון</div>
                          <div className="font-bold text-white text-lg">{lastWeight} ק"ג</div>
                        </div>
                      )}
                      {recommendedWeight !== null && (
                        <div className="bg-gray-800/60 p-3 rounded-lg">
                          <div className="text-sm text-green-400 mb-1">משקל מומלץ</div>
                          <div className="font-bold text-white text-lg">{recommendedWeight} ק"ג</div>
                        </div>
                      )}
                    </div>
                    {activeWorkoutRecommendation && (
                      <div className="mt-3 text-xs text-blue-300">
                        {activeWorkoutRecommendation.overloadAdjustment === 'increase' && 
                          "המערכת ממליצה להעלות את המשקלים בהדרגה בהתאם להתקדמות שלך."}
                        {activeWorkoutRecommendation.overloadAdjustment === 'decrease' && 
                          "המערכת ממליצה להפחית את המשקלים לתקופה קצרה לאפשר התאוששות טובה יותר."}
                        {activeWorkoutRecommendation.deload && 
                          " מומלץ לבצע שבוע דילואד - הפחתת עומסים לשיפור ההתאוששות."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {restTimer === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">משקל (ק״ג)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full p-2 border-2 border-gray-700 bg-gray-800 rounded-lg text-gray-200 focus:border-purple-600 focus:ring focus:ring-purple-700 focus:ring-opacity-50"
                      placeholder={recommendedWeight ? `מומלץ: ${recommendedWeight}` : "הכנס משקל"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      חזרות (יעד: {activeExercise.targetReps})
                    </label>
                    <input
                      type="number"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="w-full p-2 border-2 border-gray-700 bg-gray-800 rounded-lg text-gray-200 focus:border-purple-600 focus:ring focus:ring-purple-700 focus:ring-opacity-50"
                      placeholder="הכנס חזרות"
                    />
                  </div>
                </div>

                <button
                  onClick={completeSet}
                  disabled={!weight || !reps}
                  className="w-full px-4 py-2 bg-purple-700 text-gray-200 rounded-lg hover:bg-purple-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-600"
                >
                  השלם סט
                </button>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-purple-800 p-3 rounded-lg border border-purple-700">
                <div className="text-sm text-purple-300">סטים שנותרו</div>
                <div className="text-lg font-semibold text-purple-200">{remainingSets}</div>
              </div>
              <div className="bg-green-800 p-3 rounded-lg border border-green-700">
                <div className="text-sm text-green-300">תרגילים שנותרו</div>
                <div className="text-lg font-semibold text-green-200">{remainingExercises}</div>
              </div>
            </div>
          </div>

          {/* Next Exercise Preview */}
          {remainingExercises > 0 && workout && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">תרגיל הבא</div>
              <div className="font-medium text-gray-200">
                {workout.exercises[currentExerciseIndex + 1].name}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};