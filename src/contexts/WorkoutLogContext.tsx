import React, { createContext, useContext, useState } from 'react';
import { WorkoutLog } from '../types/workout';

interface WorkoutLogContextType {
  workoutLogs: { [userId: string]: WorkoutLog[] };
  addWorkoutLog: (userId: string, log: WorkoutLog) => void;
  getWorkoutLogs: (userId: string) => WorkoutLog[];
}

const WorkoutLogContext = createContext<WorkoutLogContextType | undefined>(undefined);

export const WorkoutLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workoutLogs, setWorkoutLogs] = useState<{ [userId: string]: WorkoutLog[] }>({});

  const addWorkoutLog = (userId: string, log: WorkoutLog) => {
    setWorkoutLogs(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), log].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    }));
  };

  const getWorkoutLogs = (userId: string): WorkoutLog[] => {
    return workoutLogs[userId] || [];
  };

  return (
    <WorkoutLogContext.Provider value={{ workoutLogs, addWorkoutLog, getWorkoutLogs }}>
      {children}
    </WorkoutLogContext.Provider>
  );
};

export const useWorkoutLog = () => {
  const context = useContext(WorkoutLogContext);
  if (context === undefined) {
    throw new Error('useWorkoutLog must be used within a WorkoutLogProvider');
  }
  return context;
};