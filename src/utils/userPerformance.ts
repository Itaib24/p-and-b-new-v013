export const calculateUserPerformance = (
  engagementLevel: number,
  progressLevel: number,
  weeklyIntensity: number
): number => {
  const average = (engagementLevel + progressLevel + weeklyIntensity) / 3;
  return Math.round(average);
};