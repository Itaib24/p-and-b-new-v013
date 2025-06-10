import { User } from '../types/user';
import { Trainer } from '../data/trainers';
import { WorkoutLog } from '../types/workout';
import { getOverviewById } from '../data/overview';
import { calculateUserProgress } from './userProgress';
import { calculateEngagementRate } from './engagementUtils';
import { calculateWeeklyIntensity } from './workoutUtils';

// Types for KPI data structure
interface TrainerMetrics {
  avgResponseTime: number; // hours
  messagesPerClient: number;
  planCustomizationsMonthly: number;
  chatbotOverrideRate: number; // percentage
  clientsWithUpdatedNotes: number; // percentage
  clientStatusReviewRate: number; // percentage
  trainerSatisfactionScore: number; // out of 10
}

interface ClientMetrics {
  workoutAdherenceRate: number; // percentage
  mealPlanAdherenceRate: number; // percentage
  checkInCompletionRate: number; // percentage
  programProgressScore: number; // percentage
  aiChatbotInteractionRate: number; // interactions per week
  featureAdoptionCoverage: number; // percentage
  clientSentimentScore: number; // percentage
  clientSatisfactionScore: number; // out of 10
}

interface PlatformMetrics {
  weeklyActiveUserRate: number; // percentage
  avgSessionDuration: number; // minutes
  sessionFrequency: number; // per week
  actionsPerSession: number;
}

interface TrainerBreakdown {
  responseTimeDistribution: { trainer: string; hours: number; }[];
  planCustomizationRate: { trainer: string; rate: number; }[];
}

interface ClientBreakdown {
  adherenceByGoal: { goalType: string; adherenceRate: number; }[];
  progressDistribution: { segment: string; percentage: number; }[];
}

interface PlatformBreakdown {
  userActivityTimeline: { hour: string; count: number; }[];
  featureUsage: { name: string; usageRate: number; }[];
}

interface Benchmarks {
  trainerTop10: number; // percentage of trainers
  trainerAcceptable: number; // percentage of trainers
  trainerAtRisk: number; // percentage of trainers
  clientTop10: number; // percentage of clients
  clientAverage: number; // percentage of clients
  clientWatchlist: number; // percentage of clients
}

interface SystemHealth {
  overallScore: number; // percentage
  trendsScore: number; // percentage
  alertsCount: number;
}

export interface KPIResults {
  // Master KPIs
  trainerProductivityScore: number;
  clientSuccessScore: number;
  platformEngagementScore: number;
  
  // Component metrics
  trainerMetrics: TrainerMetrics;
  clientMetrics: ClientMetrics;
  platformMetrics: PlatformMetrics;
  
  // Breakdowns for detailed analysis
  trainerBreakdown: TrainerBreakdown;
  clientBreakdown: ClientBreakdown;
  platformBreakdown: PlatformBreakdown;
  
  // Benchmarking
  benchmarks: Benchmarks;
  
  // System health
  systemHealth: SystemHealth;
}

export const calculateMasterKPIs = (
  users: User[],
  trainers: Trainer[],
  workoutLogs: WorkoutLog[]
): KPIResults => {
  // This is a simulation of KPI calculations since we don't have actual data
  // In a real implementation, these would be calculated from actual metrics
  
  // Simulate trainer metrics
  const trainerMetrics: TrainerMetrics = {
    avgResponseTime: 8, // hours
    messagesPerClient: 2.7,
    planCustomizationsMonthly: 1.5,
    chatbotOverrideRate: 18, // percentage
    clientsWithUpdatedNotes: 83, // percentage
    clientStatusReviewRate: 92, // percentage
    trainerSatisfactionScore: 8.3, // out of 10
  };
  
  // Simulate client metrics
  const clientMetrics: ClientMetrics = {
    workoutAdherenceRate: 87, // percentage
    mealPlanAdherenceRate: 78, // percentage
    checkInCompletionRate: 81, // percentage
    programProgressScore: 74, // percentage
    aiChatbotInteractionRate: 4.2, // interactions per week
    featureAdoptionCoverage: 82, // percentage
    clientSentimentScore: 76, // percentage
    clientSatisfactionScore: 8.1, // out of 10
  };
  
  // Simulate platform metrics
  const platformMetrics: PlatformMetrics = {
    weeklyActiveUserRate: 73, // percentage
    avgSessionDuration: 4.5, // minutes
    sessionFrequency: 5.2, // per week
    actionsPerSession: 4.3,
  };
  
  // Calculate master KPI scores based on formulas in the documentation
  const trainerProductivityScore = Math.round(
    (normalizeScore(trainerMetrics.avgResponseTime, 24, 1) * 0.2) +
    (normalizeScore(trainerMetrics.messagesPerClient, 0, 5) * 0.2) +
    (normalizeScore(trainerMetrics.planCustomizationsMonthly, 0, 3) * 0.2) +
    (trainerMetrics.clientsWithUpdatedNotes * 0.2) +
    (trainerMetrics.clientStatusReviewRate * 0.2)
  );
  
  const clientSuccessScore = Math.round(
    (clientMetrics.workoutAdherenceRate * 0.25) +
    (clientMetrics.mealPlanAdherenceRate * 0.2) +
    (clientMetrics.checkInCompletionRate * 0.15) +
    (clientMetrics.programProgressScore * 0.2) +
    (clientMetrics.clientSentimentScore * 0.1) +
    (clientMetrics.featureAdoptionCoverage * 0.1)
  );
  
  const platformEngagementScore = Math.round(
    (platformMetrics.weeklyActiveUserRate * 0.3) +
    (normalizeScore(platformMetrics.avgSessionDuration, 1, 8) * 0.2) +
    (normalizeScore(platformMetrics.sessionFrequency, 1, 7) * 0.2) +
    (normalizeScore(platformMetrics.actionsPerSession, 1, 6) * 0.2) +
    (normalizeScore(clientMetrics.aiChatbotInteractionRate, 1, 7) * 0.1)
  );

  // Simulate trainer breakdown data
  const trainerBreakdown: TrainerBreakdown = {
    responseTimeDistribution: [
      { trainer: "Sarah Jacobson", hours: 5.2 },
      { trainer: "Michael Thompson", hours: 9.8 },
      { trainer: "David Cohen", hours: 7.3 },
      { trainer: "Emma Williams", hours: 11.5 }
    ],
    planCustomizationRate: [
      { trainer: "Sarah Jacobson", rate: 1.8 },
      { trainer: "Michael Thompson", rate: 1.2 },
      { trainer: "David Cohen", rate: 0.9 },
      { trainer: "Emma Williams", rate: 1.5 }
    ]
  };
  
  // Simulate client breakdown data
  const clientBreakdown: ClientBreakdown = {
    adherenceByGoal: [
      { goalType: "Weight Loss", adherenceRate: 88 },
      { goalType: "Muscle Gain", adherenceRate: 84 },
      { goalType: "Fitness Maintenance", adherenceRate: 91 },
      { goalType: "Rehabilitation", adherenceRate: 78 }
    ],
    progressDistribution: [
      { segment: "Excellent (>85%)", percentage: 28 },
      { segment: "Good (70-85%)", percentage: 42 },
      { segment: "Average (50-70%)", percentage: 18 },
      { segment: "Needs Help (<50%)", percentage: 12 }
    ]
  };
  
  // Simulate platform breakdown data
  const platformBreakdown: PlatformBreakdown = {
    userActivityTimeline: [
      { hour: "6:00 AM", count: 42 },
      { hour: "9:00 AM", count: 68 },
      { hour: "12:00 PM", count: 95 },
      { hour: "3:00 PM", count: 87 },
      { hour: "6:00 PM", count: 120 },
      { hour: "9:00 PM", count: 76 }
    ],
    featureUsage: [
      { name: "Workout Logger", usageRate: 92 },
      { name: "Meal Tracker", usageRate: 78 },
      { name: "AI Chat", usageRate: 84 },
      { name: "Progress Tracking", usageRate: 65 }
    ]
  };
  
  // Simulate benchmark data
  const benchmarks: Benchmarks = {
    trainerTop10: 15, // percentage of trainers
    trainerAcceptable: 70, // percentage of trainers
    trainerAtRisk: 15, // percentage of trainers
    clientTop10: 12, // percentage of clients
    clientAverage: 73, // percentage of clients
    clientWatchlist: 15, // percentage of clients
  };
  
  // Simulate system health
  const systemHealth: SystemHealth = {
    overallScore: 82, // percentage
    trendsScore: 78, // percentage
    alertsCount: 5
  };

  return {
    // Master KPIs
    trainerProductivityScore,
    clientSuccessScore,
    platformEngagementScore,
    
    // Component metrics
    trainerMetrics,
    clientMetrics,
    platformMetrics,
    
    // Breakdowns
    trainerBreakdown,
    clientBreakdown,
    platformBreakdown,
    
    // Benchmarking
    benchmarks,
    
    // System health
    systemHealth
  };
};

// Helper function to normalize values to a 0-100 scale
function normalizeScore(value: number, min: number, max: number): number {
  // For inverse relationships (lower is better), like response time
  if (min > max) {
    return 100 - Math.min(100, Math.max(0, ((value - max) / (min - max)) * 100));
  }
  // For direct relationships (higher is better)
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}