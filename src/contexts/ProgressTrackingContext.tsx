import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { ProgressData, ChangeRecommendation, NutritionChange, WorkoutChange } from '../types/progress';
import { ProgressAnalyzer } from '../utils/progressAnalyzer';
import { getOverviewById } from '../data/overview';
import { users } from '../data/users';
import { useMealPlan } from './MealPlanContext';
import { useAdmin } from './AdminContext';
import { parseSetsValue, parseRepsRange } from '../utils/workoutUtils';

interface ProgressContextType {
  userProgress: Record<string, ProgressData>;
  recommendations: Record<string, ChangeRecommendation>;
  updateUserProgress: (userId: string, data: Partial<ProgressData>) => void;
  acceptRecommendation: (recommendationId: string) => void;
  rejectRecommendation: (recommendationId: string) => void;
  overrideRecommendation: (recommendationId: string) => void;
  editAndAcceptRecommendation: (
    recommendationId: string, 
    nutritionChange?: NutritionChange, 
    workoutChange?: WorkoutChange
  ) => void;
  hasRecommendations: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Sample adherence data
const sampleAdherenceData: Record<string, {workout: number, meal: number}> = {
  '1': { workout: 92, meal: 88 },
  '2': { workout: 65, meal: 72 },
  '3': { workout: 78, meal: 85 }
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { applyCalorieAdjustment } = useMealPlan();
  const { getUserTrainingPlan, updateTrainingPlan } = useAdmin();
  const [userProgress, setUserProgress] = useState<Record<string, ProgressData>>({});
  const [recommendations, setRecommendations] = useState<Record<string, ChangeRecommendation>>({});
  const analyzer = new ProgressAnalyzer();

  const hasRecommendations = Object.keys(recommendations).length > 0;

  useEffect(() => {
    // Initialize user progress data for all users
    const initialUserProgress: Record<string, ProgressData> = {};
    
    // Initialize progress data for all users
    users.forEach(user => {
      const overview = getOverviewById(user.id);
      const adherence = sampleAdherenceData[user.id] || { workout: 80, meal: 80 };
      
      if (overview) {
        initialUserProgress[user.id] = {
          userId: user.id,
          weight: overview.currentWeight,
          previousWeight: overview.currentWeight + (user.id === '2' ? 0.5 : 0),
          bodyFatPercentage: overview.currentFatPercentage,
          previousBodyFatPercentage: overview.currentFatPercentage + (user.id === '2' ? 1 : 0),
          workoutAdherence: adherence.workout,
          mealPlanAdherence: adherence.meal,
          goal: overview.goal,
          lastDataUpdate: new Date()
        };
      } else {
        // Fallback data if no overview exists
        initialUserProgress[user.id] = {
          userId: user.id,
          weight: 70, // Default weight
          previousWeight: 70,
          bodyFatPercentage: 15, // Default body fat percentage
          previousBodyFatPercentage: 15,
          workoutAdherence: adherence.workout,
          mealPlanAdherence: adherence.meal,
          goal: 'fat_loss', // Default goal
          lastDataUpdate: new Date()
        };
      }
    });
    
    // Generate an initial recommendation for demo purposes (only for user 2)
    if (initialUserProgress['2']) {
      const recommendation = analyzer.analyzeProgress('2', initialUserProgress['2']);
      if (recommendation) {
        setRecommendations({
          [recommendation.id]: recommendation
        });
      }
    }
    
    setUserProgress(initialUserProgress);
  }, []);

  const updateUserProgress = (userId: string, data: Partial<ProgressData>) => {
    setUserProgress(prev => {
      // Ensure we have the user's goal from overview if not provided
      const userGoal = data.goal || (prev[userId]?.goal || (() => {
        const overview = getOverviewById(userId);
        return overview?.goal || 'fat_loss';
      })());
      
      // Get adherence data
      const adherence = sampleAdherenceData[userId] || { workout: 80, meal: 80 };
      
      const updatedProgress = {
        ...prev,
        [userId]: {
          ...(prev[userId] || {}),
          userId,
          workoutAdherence: data.workoutAdherence || adherence.workout,
          mealPlanAdherence: data.mealPlanAdherence || adherence.meal,
          goal: userGoal as any,
          ...data,
          lastDataUpdate: new Date()
        } as ProgressData
      };
      
      // Analyze progress and generate recommendation if needed
      const progressData = updatedProgress[userId] as ProgressData;
      if (progressData.weight && 
          (progressData.previousWeight || 
           progressData.bodyFatPercentage || 
           progressData.previousBodyFatPercentage)) {
        const recommendation = analyzer.analyzeProgress(userId, progressData);
        if (recommendation) {
          setRecommendations(prevRecs => ({
            ...prevRecs,
            [recommendation.id]: recommendation
          }));
        }
      }
      
      return updatedProgress;
    });
  };

  const acceptRecommendation = (recommendationId: string) => {
    setRecommendations(prev => {
      if (!prev[recommendationId]) return prev;
      
      const rec = prev[recommendationId];
      
      // Apply nutrition change if needed
      if (rec.nutritionChange) {
        applyCalorieAdjustment(rec.userId, rec.nutritionChange.calorieChange);
      }
      
      // Apply workout change if needed
      if (rec.workoutChange && rec.workoutChange.overloadAdjustment !== 'none') {
        // Get current training plan
        const currentPlan = getUserTrainingPlan(rec.userId);
        
        // Apply overload adjustment to each exercise in the plan
        const adjustedPlan = currentPlan.map(day => ({
          ...day,
          exercises: day.exercises.map(exercise => {
            // Parse current sets and reps
            const currentSets = parseSetsValue(exercise.sets);
            const [minReps, maxReps] = parseRepsRange(exercise.reps);
            
            if (rec.workoutChange?.overloadAdjustment === 'increase') {
              // Increase exercise intensity
              return {
                ...exercise,
                sets: `${currentSets + 1} sets`,
                reps: `${minReps}-${maxReps + 2} reps`
              };
            } else if (rec.workoutChange?.overloadAdjustment === 'decrease') {
              // Decrease exercise intensity
              return {
                ...exercise,
                sets: `${Math.max(1, currentSets - 1)} sets`,
                reps: `${Math.max(4, minReps - 2)}-${maxReps} reps`
              };
            }
            return exercise;
          })
        }));
        
        // Apply deload if needed
        if (rec.workoutChange.deload) {
          // Deload implementation - reduce volume significantly
          const deloadPlan = currentPlan.map(day => ({
            ...day,
            exercises: day.exercises.map(exercise => {
              const currentSets = parseSetsValue(exercise.sets);
              const [minReps, maxReps] = parseRepsRange(exercise.reps);
              
              return {
                ...exercise,
                // Reduce volume by 40% for a deload week
                sets: `${Math.max(1, Math.floor(currentSets * 0.6))} sets`,
                reps: `${Math.floor(minReps * 0.7)}-${Math.floor(maxReps * 0.7)} reps`
              };
            })
          }));
          updateTrainingPlan(rec.userId, deloadPlan);
        } else {
          updateTrainingPlan(rec.userId, adjustedPlan);
        }
      }
      
      // Apply exercise-specific modifications if available
      if (rec.workoutChange?.exerciseModifications?.length) {
        const currentPlan = getUserTrainingPlan(rec.userId);
        
        const modifiedPlan = currentPlan.map(day => ({
          ...day,
          exercises: day.exercises.map(exercise => {
            const modification = rec.workoutChange?.exerciseModifications?.find(
              mod => mod.exerciseId === exercise.name
            );
            
            if (!modification) return exercise;
            
            // Parse current values
            const currentSets = parseSetsValue(exercise.sets);
            const [minReps, maxReps] = parseRepsRange(exercise.reps);
            
            // Apply modifications
            return {
              ...exercise,
              ...(modification.replaceWith ? { name: modification.replaceWith } : {}),
              ...(modification.setChange ? { sets: `${Math.max(1, currentSets + modification.setChange)} sets` } : {}),
              ...(modification.repChange ? { reps: `${Math.max(1, minReps + modification.repChange)}-${Math.max(1, maxReps + modification.repChange)} reps` } : {})
            };
          })
        }));
        
        updateTrainingPlan(rec.userId, modifiedPlan);
      }
      
      // Mark as approved and store review date
      return {
        ...prev,
        [recommendationId]: {
          ...rec,
          approved: true,
          reviewedAt: new Date()
        }
      };
    });
    
    // Remove the recommendation after a short delay to simulate processing
    setTimeout(() => {
      setRecommendations(prev => {
        const newRecs = { ...prev };
        delete newRecs[recommendationId];
        return newRecs;
      });
    }, 2000);
  };

  const rejectRecommendation = (recommendationId: string) => {
    // Just remove the recommendation
    setRecommendations(prev => {
      const newRecs = { ...prev };
      delete newRecs[recommendationId];
      return newRecs;
    });
  };

  const overrideRecommendation = (recommendationId: string) => {
    // Mark the recommendation as overridden and prompt for trainer input
    setRecommendations(prev => {
      if (!prev[recommendationId]) return prev;
      
      return {
        ...prev,
        [recommendationId]: {
          ...prev[recommendationId],
          trainerOverride: true
        }
      };
    });
  };

  const editAndAcceptRecommendation = (
    recommendationId: string, 
    nutritionChange?: NutritionChange, 
    workoutChange?: WorkoutChange
  ) => {
    setRecommendations(prev => {
      if (!prev[recommendationId]) return prev;
      
      const updatedRec = {
        ...prev[recommendationId],
        nutritionChange: nutritionChange || prev[recommendationId].nutritionChange,
        workoutChange: workoutChange || prev[recommendationId].workoutChange,
        trainerOverride: true
      };
      
      return {
        ...prev,
        [recommendationId]: updatedRec
      };
    });
    
    // Now accept the recommendation with the updated changes
    acceptRecommendation(recommendationId);
  };

  return (
    <ProgressContext.Provider value={{
      userProgress,
      recommendations,
      updateUserProgress,
      acceptRecommendation,
      rejectRecommendation,
      overrideRecommendation,
      editAndAcceptRecommendation,
      hasRecommendations
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};