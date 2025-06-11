import { GlobalState, GlobalActions } from './globalState';
import { ProgressData } from '../types/progress';

// Simple orchestrator placeholder that reacts to JSON commands in messages
export function orchestrateMessage(
  message: string,
  state: GlobalState,
  actions: GlobalActions
): string {
  try {
    const data = JSON.parse(message);
    if (data.progress && state.user) {
      actions.updateProgress(state.user.id, data.progress as Partial<ProgressData>);
      return 'Progress updated';
    }
    if (data.calorieChange && state.user) {
      actions.applyCalorieAdjustment(state.user.id, data.calorieChange);
      return 'Meal plan updated';
    }
  } catch {
    // message was not JSON - ignore
  }
  return 'OK';
}
