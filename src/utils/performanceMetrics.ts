interface UserMetrics {
  engagementLevel: number;
  progressLevel: number;
  weeklyIntensity: number;
}

/**
 * Calculates the average performance score across all users
 * @param userMetrics Array of user metrics containing engagement, progress and intensity levels
 * @returns Average performance score rounded to 2 decimal places
 */
export const calculateAveragePerformance = (userMetrics: UserMetrics[]): number => {
  if (!userMetrics.length) return 0;

  const totalScore = userMetrics.reduce((sum, metrics) => {
    const performanceScore = 
      (metrics.engagementLevel * 0.33) + 
      (metrics.progressLevel * 0.33) + 
      (metrics.weeklyIntensity * 0.33);
    return sum + performanceScore;
  }, 0);

  return Number((totalScore / userMetrics.length).toFixed(2));
};