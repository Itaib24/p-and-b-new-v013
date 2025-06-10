import React, { createContext, useContext, useState } from 'react';
import { User } from '../types/user';
import { Trainer } from '../data/trainers';
import { WorkoutLog } from '../types/workout';
import { trainers as initialTrainers } from '../data/trainers';
import { users as initialUsers } from '../data/users';
import { workoutLogs as initialWorkoutLogs } from '../data/workoutLogs';
import { calculateTrainerAnalytics } from '../utils/trainerAnalytics';
import { TrainingDay } from '../types/training';
import { trainingPlan as initialTrainingPlan } from '../data/trainingPlan';

interface AdminContextType {
  trainers: Trainer[];
  users: User[];
  workoutLogs: WorkoutLog[];
  trainingPlan: Record<string, TrainingDay[]>;
  getTrainerAnalytics: (trainerId: string) => any;
  addTrainer: (trainer: Trainer) => void;
  updateTrainer: (trainerId: string, updates: Partial<Trainer>) => void;
  removeTrainer: (trainerId: string) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  removeUser: (userId: string) => void;
  updateTrainingPlan: (userId: string, newPlan: TrainingDay[]) => void;
  getUserTrainingPlan: (userId: string) => TrainingDay[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(initialWorkoutLogs);
  // Initialize with default training plan for user 1 and copy for other users
  const [trainingPlan, setTrainingPlan] = useState<Record<string, TrainingDay[]>>({
    '1': initialTrainingPlan,
    '2': initialTrainingPlan,
    '3': initialTrainingPlan
  });

  const getTrainerAnalytics = (trainerId: string) => {
    const trainer = trainers.find(t => t.id === trainerId);
    if (!trainer) return null;
    return calculateTrainerAnalytics(trainer, users, workoutLogs);
  };

  const addTrainer = (trainer: Trainer) => {
    setTrainers([...trainers, trainer]);
  };

  const updateTrainer = (trainerId: string, updates: Partial<Trainer>) => {
    setTrainers(trainers.map(trainer => 
      trainer.id === trainerId ? { ...trainer, ...updates } : trainer
    ));
  };

  const removeTrainer = (trainerId: string) => {
    setTrainers(trainers.filter(trainer => trainer.id !== trainerId));
  };

  const addUser = (user: User) => {
    setUsers([...users, user]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  const removeUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const updateTrainingPlan = (userId: string, newPlan: TrainingDay[]) => {
    setTrainingPlan(prevPlans => ({
      ...prevPlans,
      [userId]: newPlan
    }));
  };

  const getUserTrainingPlan = (userId: string): TrainingDay[] => {
    return trainingPlan[userId] || initialTrainingPlan;
  };

  return (
    <AdminContext.Provider value={{
      trainers,
      users,
      workoutLogs,
      trainingPlan,
      getTrainerAnalytics,
      addTrainer,
      updateTrainer,
      removeTrainer,
      addUser,
      updateUser,
      removeUser,
      updateTrainingPlan,
      getUserTrainingPlan
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};