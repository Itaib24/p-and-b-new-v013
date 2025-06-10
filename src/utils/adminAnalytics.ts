import { User } from '../types/user';
import { WorkoutLog } from '../types/workout';
import { getOverviewById } from '../data/overview';
import { calculateUserProgress } from './userProgress';
import { calculateEngagementRate } from './engagementUtils';
import { calculateWeeklyIntensity } from './workoutUtils';
import { getTrainerById } from '../data/trainers';

export interface SystemAnalytics {
  totalUsers: number;
  activeUsers: number;
  userGrowth: number;
  averageEngagement: number;
  goalAchievement: number;
  churnRate: number;
  trainerPerformance: {
    name: string;
    success: number;
    trainees: number;
  }[];
  categoryAchievement: {
    category: string;
    rate: number;
  }[];
  userActivity: {
    time: string;
    count: number;
    type: string;
  }[];
}

export const calculateSystemAnalytics = (users: User[], workoutLogs: WorkoutLog[]): SystemAnalytics => {
  // Calculate active users
  const activeUsers = users.filter(user => user.status === 'active').length;
  
  // Calculate user growth based on membership start dates
  const lastMonthUsers = users.filter(user => {
    const overview = getOverviewById(user.id);
    const joinDate = new Date(overview.membershipStartDate);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return joinDate >= monthAgo;
  }).length;

  const userGrowth = (lastMonthUsers / users.length) * 100;

  // Calculate average engagement from real user data
  const engagementRates = users.map(user => {
    const overview = getOverviewById(user.id);
    return overview.engagementLevel;
  });

  const averageEngagement = engagementRates.reduce((sum, rate) => sum + rate, 0) / engagementRates.length;

  // Calculate goal achievement from real progress data
  const goalAchievements = users.map(user => {
    const overview = getOverviewById(user.id);
    const userLogs = workoutLogs.filter(log => log.userId === user.id);
    return calculateUserProgress(
      user,
      userLogs,
      overview.startingWeight,
      overview.currentWeight,
      overview.startingFatPercentage,
      overview.currentFatPercentage,
      overview.goal
    );
  });

  const averageGoalAchievement = goalAchievements.reduce((sum, achievement) => sum + achievement, 0) / goalAchievements.length;

  // Calculate churn rate from real user statuses
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;
  const churnRate = (inactiveUsers / users.length) * 100;

  // Calculate trainer performance from real data
  const trainerPerformance = users.reduce((acc, user) => {
    const trainer = getTrainerById(user.trainerId);
    if (!trainer) return acc;

    const existingTrainer = acc.find(t => t.name === trainer.name);
    if (existingTrainer) {
      existingTrainer.trainees++;
      const overview = getOverviewById(user.id);
      existingTrainer.success = (existingTrainer.success + overview.progressLevel) / 2;
    } else {
      const overview = getOverviewById(user.id);
      acc.push({
        name: trainer.name,
        success: overview.progressLevel,
        trainees: 1
      });
    }
    return acc;
  }, [] as { name: string; success: number; trainees: number }[]);

  // Calculate category achievement rates from real user data
  const categoryAchievement = users.reduce((acc, user) => {
    const overview = getOverviewById(user.id);
    const category = overview.goal === 'fat_loss' ? 'Weight Loss' : 'Muscle Gain';
    
    const existingCategory = acc.find(c => c.category === category);
    if (existingCategory) {
      existingCategory.rate = (existingCategory.rate + overview.progressLevel) / 2;
    } else {
      acc.push({
        category,
        rate: overview.progressLevel
      });
    }
    return acc;
  }, [] as { category: string; rate: number }[]);

  // Calculate real user activity from workout logs
  const today = new Date();
  const userActivity = [];
  
  // Last 4 hours of activity
  for (let i = 0; i < 4; i++) {
    const hour = today.getHours() - i;
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    
    // Count workouts logged in this hour
    const workoutsLogged = workoutLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getHours() === hour;
    }).length;

    userActivity.push({
      time: timeString,
      count: workoutsLogged,
      type: 'Workouts Logged'
    });
  }

  return {
    totalUsers: users.length,
    activeUsers,
    userGrowth,
    averageEngagement,
    goalAchievement: averageGoalAchievement,
    churnRate,
    trainerPerformance,
    categoryAchievement,
    userActivity
  };
};