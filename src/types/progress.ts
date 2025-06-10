import { z } from 'zod';

export type GoalType = 'fat_loss' | 'muscle_gain' | 'recomp';

export interface ProgressData {
  userId: string;
  weight: number; 
  previousWeight?: number;
  bodyFatPercentage?: number;
  previousBodyFatPercentage?: number; 
  workoutAdherence: number; // percentage
  mealPlanAdherence: number; // percentage
  goal: GoalType;
  lastDataUpdate: Date;
  lastAdjustmentDate?: Date; // Track when adjustments were made
  nutritionAdjustment?: number; // Track calorie changes
  workoutAdjustment?: 'increase' | 'decrease' | 'none'; // Track workout changes
  weeklyTarget?: number; // Track weight targets
}

export interface DerivedMetrics {
  leanBodyMass: number; 
  previousLeanBodyMass?: number; 
  fatMass: number; 
  previousFatMass?: number;
  deltaLBM?: number; // change in LBM
  deltaFM?: number; // change in fat mass
  muscleGainEfficiency?: number; // for muscle gain
  fatLossEfficiency?: number; // for fat loss
  recompScore?: number; // for recomp
}

export interface NutritionChange {
  calorieChange: number;
  reason: string;
  mealTargets?: string[]; // Which meals to apply changes to
  macroAdjustments?: {
    protein?: number;
    carbs?: number; 
    fats?: number;
  }; // Specific macro adjustments
}

export interface WorkoutChange {
  overloadAdjustment: 'none' | 'increase' | 'decrease';
  deload: boolean;
  reason: string;
  exerciseModifications?: {
    exerciseId: string;
    replaceWith?: string;
    setChange?: number;
    repChange?: number;
    weightChange?: number;
    restChange?: number;
  }[]; // Specific exercise changes
}

export interface ChangeRecommendation {
  id: string;
  userId: string;
  status: string;
  goal: GoalType;
  nutritionChange?: NutritionChange;
  workoutChange?: WorkoutChange;
  confidence: 'High' | 'Medium' | 'Low';
  trainerOverride: boolean;
  userMessage: string;
  generatedAt: Date;
  reviewedAt?: Date;
  approved?: boolean;
}