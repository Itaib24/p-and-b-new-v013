import { WorkoutLog } from '../types/workout';
import { 
  calculateBCSFatLoss, 
  calculateBCSMuscleGain, 
  calculateWPS, 
  calculateOPL 
} from './progressCalculations';

export const calculateUserProgress = (
  workoutLogs: WorkoutLog[] = [], // Default to empty array to handle missing logs
  startingWeight: number,
  currentWeight: number,
  startingFat: number,
  currentFat: number,
  goal: 'fat_loss' | 'muscle_gain'
): number => {
  // Calculate BCS based on goal
  const bcs = goal === 'fat_loss'
    ? calculateBCSFatLoss(startingFat, currentFat)
    : calculateBCSMuscleGain(startingWeight, currentWeight, startingFat, currentFat);

  // Calculate WPS
  const wps = calculateWPS(workoutLogs);

  // Calculate and return OPL
  return calculateOPL(bcs, wps);
};