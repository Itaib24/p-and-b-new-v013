import { ProgressData, DerivedMetrics, ChangeRecommendation, GoalType } from '../types/progress';

export class ProgressAnalyzer {
  // Calculate derived metrics from basic progress data
  calculateDerivedMetrics(data: ProgressData): DerivedMetrics {
    const lbm = data.weight * (1 - (data.bodyFatPercentage || 0) / 100);
    const fatMass = data.weight * ((data.bodyFatPercentage || 0) / 100);
    
    let previousLBM;
    let previousFatMass;
    let deltaLBM;
    let deltaFM;
    let muscleGainEfficiency;
    let fatLossEfficiency;
    let recompScore;
    
    if (data.previousWeight && data.previousBodyFatPercentage) {
      previousLBM = data.previousWeight * (1 - data.previousBodyFatPercentage / 100);
      previousFatMass = data.previousWeight * (data.previousBodyFatPercentage / 100);
      
      deltaLBM = lbm - previousLBM;
      deltaFM = previousFatMass - fatMass;
      
      if (data.goal === 'muscle_gain' && (data.weight > data.previousWeight)) {
        muscleGainEfficiency = (deltaLBM / (data.weight - data.previousWeight)) * 100;
      }
      
      if (data.goal === 'fat_loss' && (data.weight < data.previousWeight)) {
        fatLossEfficiency = (Math.abs(fatMassChange) / Math.abs(data.previousWeight - data.weight)) * 100;
      }
      
      recompScore = deltaLBM - deltaFM;
    }
    
    return {
      leanBodyMass: lbm,
      previousLeanBodyMass: previousLBM,
      fatMass,
      previousFatMass,
      deltaLBM,
      deltaFM,
      muscleGainEfficiency,
      fatLossEfficiency,
      recompScore
    };
  }
  
  // Validate data for safety and consistency
  validateData(data: ProgressData): {valid: boolean, reason?: string} {
    // Check if we have weight data
    if (!data.weight) {
      return {valid: false, reason: "חסרים נתוני משקל נוכחיים"};
    }
    
    // Check for drastic changes
    if (data.previousWeight) {
      const percentChange = Math.abs((data.weight - data.previousWeight) / data.previousWeight * 100);
      if (percentChange > 3) {
        return {valid: false, reason: `זוהה שינוי משקל קיצוני (${percentChange.toFixed(1)}%)`};
      }
    }
    
    // Check for missing historical data for comparisons
    if (!data.previousWeight && !data.previousBodyFatPercentage) {
      return {valid: false, reason: "חסרים נתונים היסטוריים להשוואה"};
    }
    
    // Check for contradictory data
    if (data.bodyFatPercentage && data.previousBodyFatPercentage) {
      const bfChange = Math.abs(data.bodyFatPercentage - data.previousBodyFatPercentage);
      if (bfChange > 5 && data.previousWeight && Math.abs(data.weight - data.previousWeight) < 2) {
        return {valid: false, reason: "נתונים סותרים: שינוי גדול באחוז שומן ללא שינוי משמעותי במשקל"};
      }
    }
    
    return {valid: true};
  }
  
  // Classify progress based on goal and metrics
  classifyProgress(data: ProgressData, metrics: DerivedMetrics): string {
    switch(data.goal) {
      case 'muscle_gain':
        if (!metrics.deltaLBM) return "נתונים לא מספקים";
        
        if (metrics.muscleGainEfficiency && metrics.deltaLBM > 0.5 && metrics.muscleGainEfficiency > 70) {
          return "התקדמות טובה";
        } else if (metrics.deltaLBM < 0.3 && data.workoutAdherence > 85) {
          return "התקדמות איטית";
        } else if (metrics.muscleGainEfficiency && metrics.muscleGainEfficiency < 60 && data.weight > (data.previousWeight || 0)) {
          return "עלייה בעיקר בשומן";
        } else if (metrics.deltaLBM > 0) {
          return "התקדמות איטית";
        } else {
          return "אין עלייה במסת שריר";
        }
        
      case 'fat_loss':
        if (!metrics.deltaFM) return "נתונים לא מספקים";
        
        if (metrics.fatLossEfficiency && metrics.deltaFM > 1 && metrics.fatLossEfficiency > 80) {
          return "התקדמות טובה";
        } else if (metrics.deltaFM < 0.5 && data.mealPlanAdherence > 85) {
          return "פלטו (היענות גבוהה)";
        } else if (metrics.deltaFM < 0.5 && data.mealPlanAdherence < 70) {
          return "פלטו (היענות נמוכה)";
        } else if (metrics.deltaLBM && metrics.deltaLBM < 0) {
          return "סיכון לאובדן שריר";
        } else if (metrics.deltaFM > 0) {
          return "התקדמות איטית";
        } else {
          return "אין ירידה בשומן";
        }
        
      case 'recomp':
        if (!metrics.recompScore) return "נתונים לא מספקים";
        
        if (metrics.recompScore > 0.5) {
          return "התקדמות טובה";
        } else if (metrics.recompScore > 0) {
          return "התקדמות איטית";
        } else if (metrics.recompScore === 0 && data.mealPlanAdherence > 85) {
          return "פלטו";
        } else {
          return "התקדמות שלילית";
        }
    }
  }
  
  // Generate recommendation based on data, metrics, and status
  generateRecommendation(userId: string, data: ProgressData, metrics: DerivedMetrics, status: string): ChangeRecommendation {
    let nutritionChange;
    let workoutChange;
    let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
    let userMessage = '';
    
    // Determine confidence level
    if (data.bodyFatPercentage && data.previousBodyFatPercentage && data.workoutAdherence > 80 && data.mealPlanAdherence > 80) {
      confidence = 'High';
    } else if (!data.bodyFatPercentage || !data.previousBodyFatPercentage || data.workoutAdherence < 70 || data.mealPlanAdherence < 70) {
      confidence = 'Low';
    }
    
    // Generate recommendations based on status and adherence levels
    if (data.workoutAdherence >= 70 && data.mealPlanAdherence >= 70) {
      if ((status.includes('פלטו') || status.includes('התקדמות איטית')) && data.goal === 'muscle_gain') {
        nutritionChange = {
          calorieChange: 100,
          reason: "פלטו בבניית שריר למרות היענות גבוהה."
        };
        userMessage = "אנו מגדילים מעט את הקלוריות שלך כדי לסייע בבניית יותר שריר מכיוון שאתה מתאמן בעקביות.";
      } 
      else if (status.includes('פלטו') && data.goal === 'fat_loss') {
        nutritionChange = {
          calorieChange: -100,
          reason: "פלטו בירידה בשומן למרות היענות גבוהה."
        };
        userMessage = "שמנו לב שירידת המשקל שלך נעצרה, אז אנו מפחיתים מעט את הקלוריות היומיות שלך כדי לחדש את ההתקדמות.";
      }
      else if (status.includes('סיכון לאובדן שריר')) {
        nutritionChange = {
          calorieChange: 100,
          reason: "זוהה סיכון לאובדן מסת שריר."
        };
        workoutChange = {
          overloadAdjustment: 'increase',
          deload: false,
          reason: "הגדל אימוני כוח לשימור מסת שריר."
        };
        userMessage = "זיהינו אובדן פוטנציאלי של מסת שריר. אנו מגדילים מעט את הקלוריות שלך וממליצים להתמקד יותר באימוני כוח.";
      }
      else if (status.includes('עלייה בעיקר בשומן')) {
        nutritionChange = {
          calorieChange: -50,
          reason: "עלייה במשקל עם יחס שריר:שומן לא אופטימלי."
        };
        workoutChange = {
          overloadAdjustment: 'increase',
          deload: false,
          reason: "הגדל עצימות אימונים לשיפור גירוי שריר."
        };
        userMessage = "המשקל שלך עולה אבל אנו רוצים לשפר את יעילות בניית השריר. אנו מפחיתים מעט את הקלוריות ומגדילים את עצימות האימון.";
      }
    } 
    else if (data.workoutAdherence < 70) {
      workoutChange = {
        overloadAdjustment: 'none',
        deload: false,
        reason: "היענות נמוכה לאימונים. התמקד בעקביות לפני התאמות."
      };
      userMessage = "שמנו לב שהחמצת מספר אימונים. בוא נתמקד בעקביות לפני שנבצע שינויים בתוכנית שלך.";
    } 
    else if (data.mealPlanAdherence < 70) {
      userMessage = "ההיענות שלך לתזונה הייתה נמוכה. בוא נעבוד על מעקב עקבי יותר אחר תוכנית התזונה לפני ביצוע התאמות.";
    }
    
    // If nothing specific was triggered, provide a general update
    if (!nutritionChange && !workoutChange && !userMessage) {
      if (status.includes('התקדמות טובה')) {
        userMessage = "עבודה מצוינת! אתה מתקדם בצורה נהדרת. המשך כך!";
      } else if (status.includes('התקדמות איטית')) {
        userMessage = "אתה מתקדם, אבל בקצב איטי מהאופטימלי. בוא נמשיך לעקוב ונראה איך השבוע הבא יתפתח.";
      } else {
        userMessage = "אנחנו מנטרים את התקדמותך. המשך לעקוב אחר התוכנית הנוכחית ונבצע התאמות לפי הצורך.";
      }
    }
    
    return {
      id: `rec-${Date.now()}-${userId}`,
      userId,
      status,
      goal: data.goal,
      nutritionChange,
      workoutChange,
      confidence,
      trainerOverride: false,
      userMessage,
      generatedAt: new Date()
    };
  }
  
  // Main function to analyze progress and generate recommendation
  analyzeProgress(userId: string, data: ProgressData): ChangeRecommendation | null {
    // First validate the data
    const validation = this.validateData(data);
    if (!validation.valid) {
      return {
        id: `rec-${Date.now()}-${userId}`,
        userId,
        status: "אימות נתונים נכשל",
        goal: data.goal,
        confidence: 'Low',
        trainerOverride: true,
        userMessage: `לא הצלחנו לנתח את התקדמותך: ${validation.reason}. אנא ודא שאתה מתעד את הנתונים שלך בעקביות.`,
        generatedAt: new Date()
      };
    }
    
    // Calculate derived metrics
    const metrics = this.calculateDerivedMetrics(data);
    
    // Classify progress
    const status = this.classifyProgress(data, metrics);
    
    // Generate recommendation
    return this.generateRecommendation(userId, data, metrics, status);
  }
}