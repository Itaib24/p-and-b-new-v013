import { Trainer } from '../data/trainers';
import { User } from '../types/user';
import { WorkoutLog } from '../types/workout';
import { getOverviewById } from '../data/overview';
import { calculateUserProgress } from './userProgress';
import { calculateEngagementRate } from './engagementUtils';
import { calculateWeeklyIntensity } from './workoutUtils';
import { getClientsByTrainerId } from '../data/trainers';

export interface TrainerAnalytics {
  activeClients: number;
  totalClients: number;
  clientRetention: number;
  avgClientProgress: number;
  weeklyMetrics: {
    completedSessions: number;
    missedSessions: number;
    goalsAchieved: number;
  };
  clientProgress: {
    userId: string;
    name: string;
    progress: number;
    goal: 'fat_loss' | 'muscle_gain';
    status: 'ahead' | 'on_track' | 'behind';
  }[];
  performanceMetrics: {
    clientRetention: number[];
    clientProgress: number[];
    responseTime: number[];
  };
}

export const calculateTrainerAnalytics = (
  trainer: Trainer,
  users: User[],
  workoutLogs: WorkoutLog[]
): TrainerAnalytics => {
  const clientIds = getClientsByTrainerId(trainer.id);
  const clients = users.filter(user => clientIds.includes(user.id));
  const activeClients = clients.filter(client => client.status === 'active');

  // Calculate client progress
  const clientProgress = clients.map(client => {
    const overview = getOverviewById(client.id);
    const progress = calculateUserProgress(
      client,
      workoutLogs.filter(log => log.userId === client.id),
      overview.startingWeight,
      overview.currentWeight,
      overview.startingFatPercentage,
      overview.currentFatPercentage,
      overview.goal
    );

    return {
      userId: client.id,
      name: client.name,
      progress,
      goal: overview.goal,
      status: progress >= 90 ? 'ahead' : progress >= 70 ? 'on_track' : 'behind'
    };
  });

  // Calculate weekly metrics
  const lastWeekLogs = workoutLogs.filter(log => {
    const logDate = new Date(log.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo && clientIds.includes(log.userId);
  });

  // Get historical data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  });

  const dailyMetrics = last7Days.map(date => {
    const dayLogs = workoutLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.toDateString() === date.toDateString() && 
             clientIds.includes(log.userId);
    });

    const activeClientsCount = clients.filter(client => {
      const overview = getOverviewById(client.id);
      return overview.engagementLevel > 0;
    }).length;

    return {
      retention: (activeClientsCount / clients.length) * 100,
      progress: (dayLogs.length / clients.length) * 100,
      responseTime: Math.random() * 2 + 1 // Simulated response time between 1-3 hours
    };
  });

  return {
    activeClients: activeClients.length,
    totalClients: clients.length,
    clientRetention: (activeClients.length / clients.length) * 100,
    avgClientProgress: clientProgress.reduce((sum, c) => sum + c.progress, 0) / clientProgress.length,
    weeklyMetrics: {
      completedSessions: lastWeekLogs.length,
      missedSessions: (clients.length * 3) - lastWeekLogs.length, // Assuming 3 sessions per week
      goalsAchieved: clientProgress.filter(c => c.progress >= 80).length
    },
    clientProgress,
    performanceMetrics: {
      clientRetention: dailyMetrics.map(m => m.retention),
      clientProgress: dailyMetrics.map(m => m.progress),
      responseTime: dailyMetrics.map(m => m.responseTime)
    }
  };
};