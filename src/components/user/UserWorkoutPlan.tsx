import React, { useState } from 'react';
import { Dumbbell, Calendar, Clock, ChevronDown, ChevronUp, AlertCircle, Play, Video, Info, Target } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useProgress } from '../../contexts/ProgressTrackingContext';

interface UserWorkoutPlanProps {
  userId: string;
}

export const UserWorkoutPlan: React.FC<UserWorkoutPlanProps> = ({ userId }) => {
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<{ day: number; exercise: number } | null>(null);
  const { getUserTrainingPlan } = useAdmin();
  const { recommendations } = useProgress();
  
  const trainingPlan = getUserTrainingPlan(userId);
  
  // Get any active workout recommendation for this user
  const activeWorkoutRecommendation = Object.values(recommendations)
    .find(rec => rec.userId === userId && rec.workoutChange && rec.approved)?.workoutChange;

  const toggleDayExpand = (index: number) => {
    if (expandedDay === index) {
      setExpandedDay(null);
    } else {
      setExpandedDay(index);
    }
  };

  const toggleExerciseExpand = (dayIndex: number, exerciseIndex: number) => {
    if (expandedExercise?.day === dayIndex && expandedExercise?.exercise === exerciseIndex) {
      setExpandedExercise(null);
    } else {
      setExpandedExercise({ day: dayIndex, exercise: exerciseIndex });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 border-2 border-purple-800">
        {/* Header */}
        <div className="bg-gray-800 p-4 mb-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-900">
              <Dumbbell className="h-6 w-6 text-purple-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-200">תוכנית אימונים שבועית</h2>
              <p className="text-sm text-gray-400">התוכנית האישית שלך</p>
            </div>
          </div>
          
          {/* Recommendation Alert */}
          {activeWorkoutRecommendation && (
            <div className="mt-4 bg-blue-900/30 p-4 rounded-xl border border-blue-700/50">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-300 mb-1">התאמת תוכנית</h4>
                  <p className="text-blue-200 text-sm">
                    {activeWorkoutRecommendation.overloadAdjustment === 'increase' && 
                      "התוכנית שלך עודכנה עם הגדלה של עומסים כדי לתמוך בהתקדמות שלך."}
                    {activeWorkoutRecommendation.overloadAdjustment === 'decrease' && 
                      "התוכנית שלך עודכנה עם הפחתה זמנית בעומסים כדי לאפשר התאוששות טובה יותר."}
                    {activeWorkoutRecommendation.deload && 
                      " שבוע דילואד הופעל - זו תוכנית קלה יותר שמאפשרת התאוששות מיטבית של הגוף."}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Quick guide */}
          <div className="mt-3 bg-amber-900/40 rounded-lg p-2 border border-amber-800/50 flex items-center gap-2 text-sm">
            <Info className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <p className="text-amber-300">
              <span className="font-medium text-amber-200">טיפ:</span> לחץ על שם התרגיל כדי לראות פרטים נוספים והנחיות.
            </p>
          </div>
        </div>

        {/* Workout Days List */}
        <div className="space-y-4">
          {!trainingPlan || trainingPlan.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400">אין ימי אימון בתוכנית כרגע.</p>
            </div>
          ) : (
            trainingPlan.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-gray-800 rounded-xl shadow-md overflow-hidden border-2 border-purple-800 hover:border-purple-700 transition-all duration-200">
                {/* Day Header */}
                <div className="bg-gray-800 p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    {/* Day info */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-900 rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-200">{day.day} - {day.focus}</h3>
                    </div>
                    
                    {/* Expand/Collapse button */}
                    <button
                      onClick={() => toggleDayExpand(dayIndex)}
                      className="p-2 bg-purple-900 hover:bg-purple-800 rounded-lg"
                    >
                      {expandedDay === dayIndex ? 
                        <ChevronUp className="h-4 w-4 text-purple-300" /> : 
                        <ChevronDown className="h-4 w-4 text-purple-300" />
                      }
                    </button>
                  </div>
                  
                  {/* Exercise count indicator */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-400">
                      <Info className="h-3.5 w-3.5 mr-1" />
                      <span>{day.exercises.length} תרגילים</span>
                    </div>
                    {day.exercises.length > 0 && (
                      <div className="text-xs text-purple-400">
                        {expandedDay === dayIndex ? 
                          'לחץ על שם תרגיל כדי לראות פרטים נוספים' : 
                          'לחץ על החץ למטה כדי לראות תרגילים'
                        }
                      </div>
                    )}
                  </div>
                </div>

                {/* Exercises List */}
                {expandedDay === dayIndex && (
                  <div className="p-4 bg-gradient-to-t from-gray-800 to-gray-900">
                    <div className="bg-gray-700 rounded-lg border border-gray-600 shadow-sm overflow-hidden">
                      <div className="divide-y divide-gray-600">
                        {day.exercises.map((exercise, exerciseIndex) => (
                          <div key={exerciseIndex}>
                            <div 
                              className={`p-2 hover:bg-gray-600 transition-colors duration-200 ${
                                expandedExercise?.day === dayIndex && 
                                expandedExercise.exercise === exerciseIndex ? 'bg-gray-600' : ''
                              }`}
                            >
                              <div className="grid grid-cols-12 gap-2 items-center">
                                <div 
                                  className="col-span-5 font-medium text-gray-200 flex items-center gap-1 cursor-pointer"
                                  onClick={() => toggleExerciseExpand(dayIndex, exerciseIndex)}
                                >
                                  <button className="p-1 rounded-full hover:bg-purple-900">
                                    {expandedExercise?.day === dayIndex && 
                                     expandedExercise.exercise === exerciseIndex ? (
                                      <ChevronUp className="h-3 w-3 text-purple-300" />
                                    ) : (
                                      <ChevronDown className="h-3 w-3 text-gray-400" />
                                    )}
                                  </button>
                                  <span className="truncate">{exercise.name}</span>
                                </div>
                                <div className="col-span-2 text-center bg-purple-900 rounded p-0.5 text-purple-200 text-xs">
                                  {exercise.sets}
                                </div>
                                <div className="col-span-2 text-center bg-amber-800 rounded p-0.5 text-amber-200 text-xs">
                                  {exercise.reps}
                                </div>
                                <div className="col-span-3 text-center bg-green-900 rounded p-0.5 text-green-200 text-xs flex items-center justify-center">
                                  <Clock className="h-3 w-3 mr-0.5" />
                                  {exercise.rest.replace(' seconds rest', '')}
                                </div>
                              </div>
                            </div>
                            
                            {/* Expanded Exercise View */}
                            {expandedExercise?.day === dayIndex && 
                             expandedExercise.exercise === exerciseIndex && (
                              <div className="p-4 bg-gray-700 border-t border-gray-600">
                                <div className="bg-gray-800 rounded-lg p-4 shadow border border-gray-600 hover:border-purple-700 transition-all duration-300">
                                  <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-gray-200 flex items-center gap-2">
                                      <Dumbbell className="h-4 w-4 text-purple-400" />
                                      {exercise.name}
                                    </h4>
                                    
                                    {exercise.videoUrl && (
                                      <button
                                        onClick={() => setExpandedVideo(exercise.videoUrl || null)}
                                        className="flex items-center gap-1 px-2 py-1 bg-purple-900 text-purple-200 rounded-lg text-xs font-medium hover:bg-purple-800 transition-colors"
                                      >
                                        <Play className="h-3 w-3" />
                                        <span>צפה בהדגמה</span>
                                      </button>
                                    )}
                                  </div>
                                  
                                  <div className="flex gap-3 mb-4">
                                    <div className="flex-1 bg-purple-900/60 py-2 px-3 rounded-lg border border-purple-800 text-center">
                                      <div className="text-xs text-purple-300 mb-1">סטים</div>
                                      <div className="font-bold text-purple-100">{exercise.sets.replace('sets', '').trim()}</div>
                                    </div>
                                    
                                    <div className="flex-1 bg-amber-900/60 py-2 px-3 rounded-lg border border-amber-800 text-center">
                                      <div className="text-xs text-amber-300 mb-1">חזרות</div>
                                      <div className="font-bold text-amber-100">{exercise.reps.replace('reps', '').trim()}</div>
                                    </div>
                                    
                                    <div className="flex-1 bg-green-900/60 py-2 px-3 rounded-lg border border-green-800 text-center">
                                      <div className="text-xs text-green-300 mb-1">מנוחה</div>
                                      <div className="font-bold text-green-100 flex items-center justify-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {exercise.rest.replace('seconds rest', '').trim()}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {exercise.instructions && (
                                    <div className="bg-amber-900/30 p-3 rounded-lg border border-amber-800/50 text-amber-200 flex items-start gap-2">
                                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-400" />
                                      <div>
                                        <div className="font-medium mb-1 text-amber-100 text-sm">הנחיות לביצוע:</div>
                                        <p className="text-sm">{exercise.instructions}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Video Modal */}
      {expandedVideo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedVideo(null)}
        >
          <div 
            className="max-w-4xl w-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-2 border-purple-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative pt-[56.25%]">
              <iframe
                src={expandedVideo}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};