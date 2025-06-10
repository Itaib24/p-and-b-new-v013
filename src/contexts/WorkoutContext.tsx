import React, { createContext, useContext, useState } from 'react';

interface WorkoutSet {
  weight: number;
  reps: number;
  completed: boolean;
}

interface ActiveExercise {
  name: string;
  sets: WorkoutSet[];
  currentSet: number;
  rest: string;
  instructions?: string;
  targetReps: string;
}

interface WorkoutContextType {
  isWorkoutStarted: boolean;
  setIsWorkoutStarted: (value: boolean) => void;
  selectedDay: string;
  setSelectedDay: (value: string) => void;
  currentExerciseIndex: number;
  setCurrentExerciseIndex: (value: number) => void;
  activeExercise: ActiveExercise | null;
  setActiveExercise: (value: ActiveExercise | null) => void;
  weight: string;
  setWeight: (value: string) => void;
  reps: string;
  setReps: (value: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [activeExercise, setActiveExercise] = useState<ActiveExercise | null>(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  return (
    <WorkoutContext.Provider
      value={{
        isWorkoutStarted,
        setIsWorkoutStarted,
        selectedDay,
        setSelectedDay,
        currentExerciseIndex,
        setCurrentExerciseIndex,
        activeExercise,
        setActiveExercise,
        weight,
        setWeight,
        reps,
        setReps,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};