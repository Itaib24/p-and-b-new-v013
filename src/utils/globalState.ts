import { useMealPlan } from '../contexts/MealPlanContext';
import { useAdmin } from '../contexts/AdminContext';
import { useProgress } from '../contexts/ProgressTrackingContext';
import { TrainingDay } from '../types/training';
import { ProgressData } from '../types/progress';
import { User } from '../types/user';
import { MealPlan } from '../contexts/MealPlanContext';

export interface GlobalState {
  user: User | null;
  mealPlan: MealPlan | null;
  trainingPlan: TrainingDay[];
  progress: ProgressData | null;
}

export interface GlobalActions {
  updateProgress: (userId: string, data: Partial<ProgressData>) => void;
  updateTrainingPlan: (userId: string, plan: TrainingDay[]) => void;
  applyCalorieAdjustment: (userId: string, change: number) => void;
}

export const useGlobalState = (
  userId: string
): [GlobalState, GlobalActions] => {
  const { getMealPlanForUser, applyCalorieAdjustment } = useMealPlan();
  const { users, getUserTrainingPlan, updateTrainingPlan } = useAdmin();
  const { userProgress, updateUserProgress } = useProgress();

  const user = users.find(u => u.id === userId) || null;
  const mealPlan = getMealPlanForUser(userId);
  const trainingPlan = getUserTrainingPlan(userId);
  const progress = userProgress[userId] || null;

  const actions: GlobalActions = {
    updateProgress: updateUserProgress,
    updateTrainingPlan,
    applyCalorieAdjustment,
  };

  return [
    { user, mealPlan, trainingPlan, progress },
    actions,
  ];
};
