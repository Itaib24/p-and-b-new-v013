import { ExerciseOption } from '../types/training';

export const exerciseDatabase: ExerciseOption[] = [
  // Chest
  {
    id: 'bench_press',
    name: 'Bench Press',
    category: 'chest',
    defaultSets: '4 sets',
    defaultReps: '8-12 reps',
    defaultRest: '90 seconds rest',
    instructions: '2 seconds down, 1 second up'
  },
  {
    id: 'incline_press',
    name: 'Incline Press',
    category: 'chest',
    defaultSets: '4 sets',
    defaultReps: '8-12 reps',
    defaultRest: '90 seconds rest'
  },
  {
    id: 'decline_press',
    name: 'Decline Press',
    category: 'chest',
    defaultSets: '3 sets',
    defaultReps: '10-15 reps',
    defaultRest: '60 seconds rest'
  },
  {
    id: 'dumbbell_flyes',
    name: 'Dumbbell Flyes',
    category: 'chest',
    defaultSets: '3 sets',
    defaultReps: '12-15 reps',
    defaultRest: '60 seconds rest'
  },

  // Back
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    category: 'back',
    defaultSets: '4 sets',
    defaultReps: '10-12 reps',
    defaultRest: '90 seconds rest'
  },
  {
    id: 'seated_row',
    name: 'Seated Row',
    category: 'back',
    defaultSets: '4 sets',
    defaultReps: '10-12 reps',
    defaultRest: '90 seconds rest'
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'back',
    defaultSets: '4 sets',
    defaultReps: '6-8 reps',
    defaultRest: '120 seconds rest',
    instructions: 'Keep back straight throughout the movement'
  },

  // Legs
  {
    id: 'squat',
    name: 'Squat',
    category: 'legs',
    defaultSets: '4 sets',
    defaultReps: '8-12 reps',
    defaultRest: '120 seconds rest',
    instructions: 'Lower until thighs are parallel to floor'
  },
  {
    id: 'leg_press',
    name: 'Leg Press',
    category: 'legs',
    defaultSets: '4 sets',
    defaultReps: '10-15 reps',
    defaultRest: '90 seconds rest'
  },
  {
    id: 'leg_extension',
    name: 'Leg Extension',
    category: 'legs',
    defaultSets: '3 sets',
    defaultReps: '12-15 reps',
    defaultRest: '60 seconds rest'
  },

  // Shoulders
  {
    id: 'shoulder_press',
    name: 'Shoulder Press',
    category: 'shoulders',
    defaultSets: '4 sets',
    defaultReps: '8-12 reps',
    defaultRest: '90 seconds rest'
  },
  {
    id: 'lateral_raise',
    name: 'Lateral Raise',
    category: 'shoulders',
    defaultSets: '3 sets',
    defaultReps: '12-15 reps',
    defaultRest: '60 seconds rest'
  },

  // Arms
  {
    id: 'bicep_curl',
    name: 'Bicep Curl',
    category: 'arms',
    defaultSets: '3 sets',
    defaultReps: '12-15 reps',
    defaultRest: '60 seconds rest'
  },
  {
    id: 'tricep_extension',
    name: 'Tricep Extension',
    category: 'arms',
    defaultSets: '3 sets',
    defaultReps: '12-15 reps',
    defaultRest: '60 seconds rest'
  },

  // Abs
  {
    id: 'crunches',
    name: 'Crunches',
    category: 'abs',
    defaultSets: '3 sets',
    defaultReps: '15-20 reps',
    defaultRest: '45 seconds rest'
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'abs',
    defaultSets: '3 sets',
    defaultReps: '30-60 seconds',
    defaultRest: '45 seconds rest'
  },

  // Cardio
  {
    id: 'treadmill',
    name: 'Treadmill',
    category: 'cardio',
    defaultSets: '1 set',
    defaultReps: '20-30 minutes',
    defaultRest: 'No rest'
  },
  {
    id: 'cycling',
    name: 'Cycling',
    category: 'cardio',
    defaultSets: '1 set',
    defaultReps: '20-30 minutes',
    defaultRest: 'No rest'
  }
];

export const getExerciseById = (id: string): ExerciseOption | undefined => {
  return exerciseDatabase.find(exercise => exercise.id === id);
};

export const getExercisesByCategory = (category: string): ExerciseOption[] => {
  return exerciseDatabase.filter(exercise => exercise.category === category);
};