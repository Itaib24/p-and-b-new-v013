export interface WorkoutSet {
  weight: number;
  reps: number;
  notes?: string;
}

export interface WorkoutExercise {
  name: string;
  sets: WorkoutSet[];
}

export interface WorkoutLog {
  date: string;
  type: string;
  duration: string;
  exercises: WorkoutExercise[];
  notes?: string;
}