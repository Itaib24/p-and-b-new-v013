import { z } from 'zod';

export const exerciseSchema = z.object({
  name: z.string(),
  instructions: z.string().optional(),
  sets: z.string(),
  reps: z.string(),
  rest: z.string(),
  videoUrl: z.string().optional()
});

export const trainingDaySchema = z.object({
  day: z.string(),
  focus: z.string(),
  exercises: z.array(exerciseSchema)
});

export const trainingPlanSchema = z.array(trainingDaySchema);

export type Exercise = z.infer<typeof exerciseSchema>;
export type TrainingDay = z.infer<typeof trainingDaySchema>;
export type TrainingPlan = z.infer<typeof trainingPlanSchema>;

export const exerciseCategories = {
  chest: 'Chest',
  back: 'Back',
  legs: 'Legs',
  shoulders: 'Shoulders',
  arms: 'Arms',
  abs: 'Abs',
  cardio: 'Cardio'
} as const;

export type ExerciseCategory = keyof typeof exerciseCategories;

export interface ExerciseOption {
  id: string;
  name: string;
  category: ExerciseCategory;
  defaultSets: string;
  defaultReps: string;
  defaultRest: string;
  instructions?: string;
  videoUrl?: string;
}