import { WorkoutLog } from '../types/workout';

// Calculate Body Composition Score for fat loss
export const calculateBCSFatLoss = (startFat: number, currentFat: number): number => {
  return ((startFat - currentFat) / startFat) * 100;
};

// Calculate Body Composition Score for muscle gain
export const calculateBCSMuscleGain = (
  startWeight: number, 
  currentWeight: number,
  startFat: number,
  currentFat: number
): number => {
  // Only count weight gain if fat percentage is stable or decreasing
  if (currentFat <= startFat) {
    return ((currentWeight - startWeight) / startWeight) * 100;
  }
  return 0;
};

// Calculate total volume for a workout
const calculateWorkoutVolume = (workout: WorkoutLog): number => {
  // Check if workout is defined and has exercises
  if (!workout || !workout.exercises) {
    return 0;
  }
  
  return workout.exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((setTotal, set) => {
      return setTotal + (set.weight * set.reps);
    }, 0);
  }, 0);
};

// Calculate Workout Progress Score
export const calculateWPS = (workoutLogs: WorkoutLog[]): number => {
  if (workoutLogs.length < 2) return 0;

  // Get the first and last workout volumes
  const startVolume = calculateWorkoutVolume(workoutLogs[workoutLogs.length - 1]);
  const currentVolume = calculateWorkoutVolume(workoutLogs[0]);

  return ((currentVolume - startVolume) / startVolume) * 100;
};

// Calculate Overall Progress Level
export const calculateOPL = (
  bcs: number,
  wps: number
): number => {
  return Number(((bcs * 0.7) + (wps * 0.3)).toFixed(2));
};