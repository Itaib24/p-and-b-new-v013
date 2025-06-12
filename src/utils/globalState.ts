import { getOverviewById } from '../data/overview';
import { mealPlan } from '../data/mealPlan';
import { trainingPlan } from '../data/trainingPlan';
import { events } from '../data/events';
import { workoutLogs } from '../data/workoutLogs';
import { messages } from '../data/messages';

export interface GlobalState {
  overview: ReturnType<typeof getOverviewById> | null;
  mealPlan: typeof mealPlan | null;
  trainingPlan: typeof trainingPlan | null;
  events: typeof events | null;
  workoutLogs: typeof workoutLogs | null;
  messages: typeof messages | null;
}

export const getGlobalState = (userId: string | null): GlobalState => {
  if (!userId) {
    return {
      overview: null,
      mealPlan: null,
      trainingPlan: null,
      events: null,
      workoutLogs: null,
      messages: null
    };
  }

  return {
    overview: getOverviewById(userId),
    mealPlan,
    trainingPlan,
    events,
    workoutLogs,
    messages
  };
};
