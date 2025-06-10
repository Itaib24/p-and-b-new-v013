const userProfiles = {
  '1': {
    userName: "איתי בלסקי",
    userId: "975246466683",
    membershipStartDate: "2024-01-01",
    membershipEndDate: "2025-01-01",
    startingWeight: 82,
    currentWeight: 80,
    startingFatPercentage: 20,
    currentFatPercentage: 18,
    engagementLevel: 90,
    progressLevel: 75,
    latestChanges: "תוכנית האימונים עודכנה לכלול תרגילים מורכבים יותר.",
    latestEvents: "השתתף באתגר הכושר השנתי ודורג בעשירייה הראשונה.",
    goal: 'fat_loss' as const
  },
  '2': {
    userName: "שרה כהן",
    userId: "975246466684",
    progressOverview: "שיפור בהרגלי האכילה, עוקבת אחר תוכנית התזונה ב-85% מהזמן",
    membershipStartDate: "2024-02-01",
    membershipEndDate: "2025-02-01",
    startingWeight: 65,
    currentWeight: 63,
    startingFatPercentage: 25,
    currentFatPercentage: 23,
    engagementLevel: 65,
    progressLevel: 60,
    latestChanges: "הוספת מקורות חלבון נוספים לארוחות היומיות",
    latestEvents: "החמיצה את שתי הפגישות האחרונות, נדרש מעקב",
    goal: 'muscle_gain' as const
  },
  '3': {
    userName: "דוד לוי",
    userId: "975246466685",
    progressOverview: "מתמקד בניידות והתאוששות, מטפל בבעיות גב תחתון",
    membershipStartDate: "2024-01-15",
    membershipEndDate: "2025-01-15",
    startingWeight: 88,
    currentWeight: 85,
    startingFatPercentage: 22,
    currentFatPercentage: 20,
    engagementLevel: 78,
    progressLevel: 70,
    latestChanges: "תוכנית האימונים הותאמה לצרכי ההתאוששות",
    latestEvents: "השלים הערכת פיזיותרפיה",
    goal: 'fat_loss' as const
  }
};

export const overview = userProfiles['1'];

export const getOverviewById = (userId: string) => {
  return userProfiles[userId as keyof typeof userProfiles];
};

export const weeklyProgress = {
  intensity: "7.5/10",
  adherence: "85%"
};

export const recommendations = [
  "שקול להגדיל צריכת חלבון בימי אימון",
  "הוסף זמן התאוששות בין אימונים בעצימות גבוהה"
];