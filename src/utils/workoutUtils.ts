import { WorkoutLog } from '../types/workout';
import { trainingPlan } from '../data/trainingPlan';

// Calculate total volume for a single exercise
const calculateExerciseVolume = (weight: number, reps: number) => weight * reps;

// Calculate Actual Total Volume from workout logs
export const calculateActualVolume = (logs: WorkoutLog[]): number => {
  return logs.reduce((totalVolume, log) => {
    const exerciseVolume = log.exercises.reduce((exerciseTotal, exercise) => {
      const setsVolume = exercise.sets.reduce((setsTotal, set) => {
        return setsTotal + calculateExerciseVolume(set.weight, set.reps);
      }, 0);
      return exerciseTotal + setsVolume;
    }, 0);
    return totalVolume + exerciseVolume;
  }, 0);
};

// Calculate Planned Total Volume from training plan
export const calculatePlannedVolume = (): number => {
  // Assuming average weights based on exercise type
  const defaultWeights: { [key: string]: number } = {
    'לחיצת חזה': 80,
    'סקוואט': 100,
    'דדליפט': 120,
    'פרפר': 20,
    'לחיצה': 60,
    'פולי': 70,
    'חתירה': 65,
  };

  return trainingPlan.reduce((totalVolume, day) => {
    const dayVolume = day.exercises.reduce((dayTotal, exercise) => {
      // Estimate weight based on exercise name
      const estimatedWeight = Object.entries(defaultWeights).reduce((weight, [key, value]) => {
        if (exercise.name.toLowerCase().includes(key.toLowerCase())) {
          return value;
        }
        return weight;
      }, 60); // Default weight if no match

      const sets = parseInt(exercise.sets.split(' ')[0]);
      const [minReps, maxReps] = parseRepsRange(exercise.reps.split(' ')[0]);
      const avgReps = (minReps + maxReps) / 2;
      
      return dayTotal + (estimatedWeight * sets * avgReps);
    }, 0);
    return totalVolume + dayVolume;
  }, 0);
};

// Calculate Weekly Intensity
export const calculateWeeklyIntensity = (logs: WorkoutLog[]): number => {
  const actualVolume = calculateActualVolume(logs);
  const plannedVolume = calculatePlannedVolume();
  
  if (plannedVolume === 0) return 0;
  
  return (actualVolume / plannedVolume) * 100;
};

// Get the last weight used for an exercise
export const getLastWeightForExercise = (logs: WorkoutLog[], exerciseName: string): number | null => {
  for (const log of logs) {
    const exercise = log.exercises.find(ex => ex.name === exerciseName);
    if (exercise && exercise.sets.length > 0) {
      // Return the weight of the last set (presumably the heaviest or working set)
      return exercise.sets[exercise.sets.length - 1].weight;
    }
  }
  return null;
};

// Calculate recommended weight based on last performance
export const calculateRecommendedWeight = (
  lastWeight: number | null, 
  overloadAdjustment: 'increase' | 'decrease' | 'none' | undefined = 'none'
): number | null => {
  if (lastWeight === null) return null;
  
  // Standard weight increases for different weight ranges
  const getWeightIncrement = (weight: number): number => {
    if (weight < 20) return 1; // Small increment for light weights
    if (weight < 40) return 2; // Medium increment
    if (weight < 60) return 2.5; // Standard increment
    return 5; // Larger increment for heavier weights
  };
  
  const increment = getWeightIncrement(lastWeight);
  
  switch (overloadAdjustment) {
    case 'increase':
      return lastWeight + increment;
    case 'decrease':
      return Math.max(0, lastWeight - increment);
    default:
      return lastWeight; // Keep the same weight if no adjustment
  }
};

// Parse the sets value from string (e.g., "3 sets" -> 3)
export const parseSetsValue = (setsStr: string): number => {
  const match = setsStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

// Parse the reps value from string (e.g., "8-12 reps" -> [8, 12])
export const parseRepsRange = (repsStr: string): [number, number] => {
  const match = repsStr.match(/(\d+)-(\d+)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2])];
  }
  const singleMatch = repsStr.match(/(\d+)/);
  const value = singleMatch ? parseInt(singleMatch[1]) : 0;
  return [value, value];
};