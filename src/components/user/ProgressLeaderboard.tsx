import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Trophy, Scale, Ruler, Heart, TrendingUp, Activity, Award, Info, ChevronUp, ChevronDown, HelpCircle, Star } from 'lucide-react';

interface ProgressLeaderboardProps {
  userId: string;
  goal: 'fat_loss' | 'muscle_gain';
  currentWeight: number;
  previousWeight: number;
  currentFatPercentage: number; 
  previousFatPercentage: number;
  isTrainerView?: boolean;
}

export const ProgressLeaderboard: React.FC<ProgressLeaderboardProps> = ({
  userId,
  goal,
  currentWeight,
  previousWeight,
  currentFatPercentage,
  previousFatPercentage,
  isTrainerView = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showTips, setShowTips] = useState(false);
  
  // Calculate Lean Body Mass (Muscle Mass)
  const calculateLBM = (weight: number, fatPercentage: number): number => {
    return weight * (1 - (fatPercentage / 100));
  };
  
  const currentLBM = calculateLBM(currentWeight, currentFatPercentage);
  const previousLBM = calculateLBM(previousWeight, previousFatPercentage);
  
  // Calculate Fat Mass
  const calculateFatMass = (weight: number, fatPercentage: number): number => {
    return weight * (fatPercentage / 100);
  };
  
  const currentFatMass = calculateFatMass(currentWeight, currentFatPercentage);
  const previousFatMass = calculateFatMass(previousWeight, previousFatPercentage);

  // Calculate changes
  const weightChange = currentWeight - previousWeight;
  const lbmChange = currentLBM - previousLBM;
  const fatMassChange = currentFatMass - previousFatMass;
  const fatPercentageChange = currentFatPercentage - previousFatPercentage;
  
  // Calculate efficiency ratios
  let muscleGainEfficiency = 0;
  if (goal === 'muscle_gain' && weightChange > 0) {
    muscleGainEfficiency = (lbmChange / weightChange) * 100;
  }
  
  let fatLossEfficiency = 0;
  if (goal === 'fat_loss' && weightChange < 0) {
    fatLossEfficiency = (Math.abs(fatMassChange) / Math.abs(weightChange)) * 100;
  }

  // Get efficiency score based on goal
  const efficiencyScore = Math.round(goal === 'muscle_gain' ? muscleGainEfficiency : fatLossEfficiency);

  // Calculate primary progress percentage based on goal
  let primaryProgress = 0;
  let primaryMetricLabel = '';
  
  if (goal === 'muscle_gain') {
    primaryProgress = previousLBM > 0 ? (lbmChange / previousLBM) * 100 : 0;
    primaryMetricLabel = 'גידול במסת שריר';
  } else {
    primaryProgress = previousFatMass > 0 ? (Math.abs(fatMassChange) / previousFatMass) * 100 : 0;
    primaryMetricLabel = 'אובדן מסת שומן';
  }

  // Format to 1 decimal place
  const formatPercent = (value: number): string => {
    return value.toFixed(1);
  };

  // Get motivational message based on progress
  const getMotivationalMessage = (): string => {
    if (goal === 'muscle_gain') {
      if (muscleGainEfficiency >= 70) return "אתה במסלול מעולה! ההתקדמות שלך ב-LBM מראה שהשרירים שלך גדלים במהירות המיטבית.";
      if (muscleGainEfficiency >= 50) return "התקדמות יפה! המשך להתמקד באימונים עם משקולות ובתזונה עשירה בחלבון.";
      return "עדיין בתחילת הדרך - עם התמקדות נכונה באימונים ובתזונה תוכל לשפר את הגדילה של השריר.";
    } else {
      if (fatLossEfficiency >= 80) return "עבודה מעולה! אתה מאבד שומן ושומר על מסת שריר בצורה אופטימלית.";
      if (fatLossEfficiency >= 60) return "התקדמות טובה! המשך להקפיד על תזונה ואימון כדי לשמור על מסת שריר בזמן הפחתת שומן.";
      return "שים לב לשמירה על אימוני כוח והקפדה על צריכת חלבון כדי למנוע אובדן מסת שריר.";
    }
  };

  // Get tips based on goal
  const getTips = (): string[] => {
    if (goal === 'muscle_gain') {
      return [
        "הקפד על עודף קלורי של 200-300 קלוריות ליום",
        "צרוך לפחות 1.8 גרם חלבון לק״ג משקל גוף",
        "בצע אימוני עומס מתקדם 3-4 פעמים בשבוע",
        "התמקד באימונים מורכבים כמו סקוואט, דדליפט ולחיצת חזה",
        "הקפד על 7-9 שעות שינה ללילה לשיפור התאוששות"
      ];
    } else {
      return [
        "שמור על גירעון קלורי מתון של 300-500 קלוריות ליום",
        "צרוך לפחות 2 גרם חלבון לק״ג משקל גוף",
        "בצע אימוני כוח לפחות 2-3 פעמים בשבוע לשמירה על מסת שריר",
        "שלב אימוני HIITואימונים אירוביים לשריפת שומן אופטימלית",
        "שתה לפחות 3 ליטר מים ביום"
      ];
    }
  };

  // Get status for efficiency score
  const getEfficiencyStatus = (): string => {
    const efficiency = goal === 'muscle_gain' ? muscleGainEfficiency : fatLossEfficiency;
    if (efficiency >= 85) return "🔥 מצוין!";
    if (efficiency >= 70) return "👍 טוב";
    return "💪 בדרך";
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-xl border-2 border-purple-800 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-900 transform hover:rotate-12 transition-transform duration-300">
            <Trophy className="h-6 w-6 text-purple-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-200">התקדמות מול חודש קודם</h3>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowTips(!showTips)}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 flex items-center gap-1"
          >
            <HelpCircle className="h-4 w-4" /> 
            <span>עזרה</span>
          </button>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 bg-purple-900 rounded-full hover:bg-purple-800 transition-colors duration-200"
          >
            {showDetails ? 
              <ChevronUp className="h-5 w-5 text-purple-300" /> : 
              <ChevronDown className="h-5 w-5 text-purple-300" />}
          </button>
        </div>
      </div>
      
      {/* Tips Section */}
      {showTips && (
        <div className="mb-6 bg-purple-900/40 rounded-xl p-4 border border-purple-800 space-y-3">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-200 mb-1">טיפים להשגת {goal === 'muscle_gain' ? 'גידול שריר' : 'אובדן שומן'} אופטימלי:</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                {getTips().map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Simple Metrics Row */}
      <div className="grid grid-cols-3 gap-4 items-center mb-6">
        {/* Muscle Mass Card */}
        <div className="bg-purple-800 rounded-xl p-4 border-2 border-purple-700 hover:border-purple-600 transition-all duration-200 text-center">
          <div className="flex justify-center items-center mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center">
              <Ruler className="h-6 w-6 text-purple-300" />
            </div>
          </div>
          <h4 className="font-bold text-gray-200 mb-1">מסת שריר</h4>
          <div className="text-2xl font-bold text-purple-300">{currentLBM.toFixed(1)} <span className="text-sm">ק"ג</span></div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {lbmChange > 0 ? (
              <div className="bg-green-900 text-green-200 px-2 py-1 rounded-full text-sm font-medium flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 
                <span>עלה {lbmChange.toFixed(1)}</span>
              </div>
            ) : lbmChange < 0 ? (
              <div className="bg-red-900 text-red-200 px-2 py-1 rounded-full text-sm font-medium flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" /> 
                <span>ירד {Math.abs(lbmChange).toFixed(1)}</span>
              </div>
            ) : (
              <div className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm font-medium">
                ללא שינוי
              </div>
            )}
          </div>
        </div>

        {/* Fat Mass Card */}
        <div className="bg-purple-800 rounded-xl p-4 border-2 border-purple-700 hover:border-purple-600 transition-all duration-200 text-center">
          <div className="flex justify-center items-center mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center">
              <Heart className="h-6 w-6 text-purple-300" />
            </div>
          </div>
          <h4 className="font-bold text-gray-200 mb-1">מסת שומן</h4>
          <div className="text-2xl font-bold text-purple-300">{currentFatMass.toFixed(1)} <span className="text-sm">ק"ג</span></div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {fatMassChange < 0 ? (
              <div className="bg-green-900 text-green-200 px-2 py-1 rounded-full text-sm font-medium flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" /> 
                <span>ירד {Math.abs(fatMassChange).toFixed(1)}</span>
              </div>
            ) : fatMassChange > 0 ? (
              <div className="bg-red-900 text-red-200 px-2 py-1 rounded-full text-sm font-medium flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 
                <span>עלה {fatMassChange.toFixed(1)}</span>
              </div>
            ) : (
              <div className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm font-medium">
                ללא שינוי
              </div>
            )}
          </div>
        </div>

        {/* Efficiency Card */}
        <div className="bg-purple-800 rounded-xl p-4 border-2 border-purple-700 hover:border-purple-600 transition-all duration-200 text-center">
          <div className="flex justify-center items-center mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center">
              <Award className="h-6 w-6 text-purple-300" />
            </div>
          </div>
          <h4 className="font-bold text-gray-200 mb-1">יעילות</h4>
          <div className="text-2xl font-bold text-purple-300">{efficiencyScore}<span className="text-sm">%</span></div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {efficiencyScore >= 85 ? (
              <div className="bg-green-900 text-green-200 px-2 py-1 rounded-full text-sm font-medium">
                🔥 מצוין!
              </div>
            ) : efficiencyScore >= 70 ? (
              <div className="bg-blue-900 text-blue-200 px-2 py-1 rounded-full text-sm font-medium">
                👍 טוב
              </div>
            ) : (
              <div className="bg-yellow-900 text-yellow-200 px-2 py-1 rounded-full text-sm font-medium">
                💪 בדרך
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Expanded Details Section */}
      {showDetails && (
        <div className="mt-6 bg-gray-900 rounded-xl p-5 border border-purple-800 animate-fade-in-up">
          <h4 className="text-base font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-purple-400" />
            פירוט מלא של נתוני התקדמות
          </h4>
          
          {/* Simplified metrics table - more user friendly */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left column - Weight and Body stats */}
            <div className="bg-purple-800 rounded-xl p-4 border border-purple-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-full bg-purple-900">
                  <Scale className="h-5 w-5 text-purple-300" />
                </div>
                <h5 className="font-semibold text-gray-200">נתוני משקל והרכב גוף</h5>
              </div>
              
              <div className="space-y-3">
                {/* Weight Comparison */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">משקל</span>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      (goal === 'muscle_gain' && weightChange > 0) || (goal === 'fat_loss' && weightChange < 0) 
                        ? 'bg-green-900 text-green-200' 
                        : (goal === 'muscle_gain' && weightChange < 0) || (goal === 'fat_loss' && weightChange > 0)
                          ? 'bg-red-900 text-red-200'
                          : 'bg-gray-600 text-gray-300'
                    }`}>
                      {weightChange > 0 ? `+${weightChange.toFixed(1)}` : weightChange < 0 ? weightChange.toFixed(1) : "ללא שינוי"}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-400">קודם</div>
                      <div className="text-lg font-semibold text-gray-300">{previousWeight} ק"ג</div>
                    </div>
                    <div className="text-center p-1 bg-gray-600 rounded-full">
                      {weightChange > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-300" />
                      ) : weightChange < 0 ? (
                        <ArrowDownRight className="h-4 w-4 text-green-300" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-400">כעת</div>
                      <div className="text-lg font-semibold text-purple-300">{currentWeight} ק"ג</div>
                    </div>
                  </div>
                </div>
                
                {/* Body Fat Percentage Comparison */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">אחוז שומן</span>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      fatPercentageChange < 0 
                        ? 'bg-green-900 text-green-200' 
                        : fatPercentageChange > 0
                          ? 'bg-red-900 text-red-200'
                          : 'bg-gray-600 text-gray-300'
                    }`}>
                      {fatPercentageChange > 0 ? `+${fatPercentageChange.toFixed(1)}%` : 
                       fatPercentageChange < 0 ? `${fatPercentageChange.toFixed(1)}%` : 
                       "ללא שינוי"}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-400">קודם</div>
                      <div className="text-lg font-semibold text-gray-300">{previousFatPercentage}%</div>
                    </div>
                    <div className="text-center p-1 bg-gray-600 rounded-full">
                      {fatPercentageChange > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-red-300" />
                      ) : fatPercentageChange < 0 ? (
                        <ArrowDownRight className="h-4 w-4 text-green-300" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-400">כעת</div>
                      <div className="text-lg font-semibold text-purple-300">{currentFatPercentage}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Muscle & Fat Mass */}
            <div className="bg-purple-800 rounded-xl p-4 border border-purple-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-full bg-purple-900">
                  <Ruler className="h-5 w-5 text-purple-300" />
                </div>
                <h5 className="font-semibold text-gray-200">שינויים בהרכב גוף</h5>
              </div>
              
              <div className="space-y-3">
                {/* Muscle Mass Comparison */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">מסת שריר</span>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      lbmChange > 0 
                        ? 'bg-green-900 text-green-200' 
                        : lbmChange < 0
                          ? 'bg-red-900 text-red-200'
                          : 'bg-gray-600 text-gray-300'
                    }`}>
                      {lbmChange > 0 ? `+${lbmChange.toFixed(1)}` : 
                       lbmChange < 0 ? `${lbmChange.toFixed(1)}` : 
                       "ללא שינוי"}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-400">קודם</div>
                      <div className="text-lg font-semibold text-gray-300">{previousLBM.toFixed(1)} ק"ג</div>
                    </div>
                    <div className="text-center p-1 bg-gray-600 rounded-full">
                      {lbmChange > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-300" />
                      ) : lbmChange < 0 ? (
                        <ArrowDownRight className="h-4 w-4 text-red-300" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-400">כעת</div>
                      <div className="text-lg font-semibold text-purple-300">{currentLBM.toFixed(1)} ק"ג</div>
                    </div>
                  </div>
                </div>
                
                {/* Fat Mass Comparison */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">מסת שומן</span>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      fatMassChange < 0 
                        ? 'bg-green-900 text-green-200' 
                        : fatMassChange > 0
                          ? 'bg-red-900 text-red-200'
                          : 'bg-gray-600 text-gray-300'
                    }`}>
                      {fatMassChange > 0 ? `+${fatMassChange.toFixed(1)}` : 
                       fatMassChange < 0 ? `${fatMassChange.toFixed(1)}` : 
                       "ללא שינוי"}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-400">קודם</div>
                      <div className="text-lg font-semibold text-gray-300">{previousFatMass.toFixed(1)} ק"ג</div>
                    </div>
                    <div className="text-center p-1 bg-gray-600 rounded-full">
                      {fatMassChange > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-red-300" />
                      ) : fatMassChange < 0 ? (
                        <ArrowDownRight className="h-4 w-4 text-green-300" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-400">כעת</div>
                      <div className="text-lg font-semibold text-purple-300">{currentFatMass.toFixed(1)} ק"ג</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Efficiency Score Card */}
          <div className="mt-4 bg-purple-900/30 rounded-xl p-4 border border-purple-800/60">
            <div className="flex items-start gap-3">
              <Award className="h-10 w-10 text-purple-400 flex-shrink-0 p-2 bg-purple-800 rounded-full" />
              <div>
                <h5 className="font-semibold text-purple-300 mb-2 text-lg flex items-center gap-2">
                  יעילות {goal === 'muscle_gain' ? 'בניית שריר' : 'הפחתת שומן'}: 
                  <span className="text-xl font-bold text-white">{efficiencyScore}%</span>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${
                    efficiencyScore >= 85 ? 'bg-green-800 text-green-200' :
                    efficiencyScore >= 70 ? 'bg-blue-800 text-blue-200' :
                    'bg-yellow-800 text-yellow-200'
                  }`}>
                    {getEfficiencyStatus()}
                  </span>
                </h5>
                <p className="text-gray-300">{getMotivationalMessage()}</p>
              </div>
            </div>
            
            {/* Simple Progress Bar */}
            <div className="mt-3">
              <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    efficiencyScore >= 85 ? 'bg-green-600' :
                    efficiencyScore >= 70 ? 'bg-blue-600' :
                    'bg-yellow-600'
                  }`}
                  style={{ width: `${Math.min(100, efficiencyScore)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Summary - Performance Badge */}
      <div className="mt-6 flex justify-center">
        <div className={`px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg transform hover:scale-105 transition-transform duration-300 ${
          goal === 'muscle_gain'
            ? (muscleGainEfficiency >= 70 ? 'bg-gradient-to-r from-green-900 to-green-800 text-green-100 border border-green-700' :
               muscleGainEfficiency >= 50 ? 'bg-gradient-to-r from-yellow-900 to-yellow-800 text-yellow-100 border border-yellow-700' :
               'bg-gradient-to-r from-red-900 to-red-800 text-red-100 border border-red-700')
            : (fatLossEfficiency >= 80 ? 'bg-gradient-to-r from-green-900 to-green-800 text-green-100 border border-green-700' :
               fatLossEfficiency >= 60 ? 'bg-gradient-to-r from-yellow-900 to-yellow-800 text-yellow-100 border border-yellow-700' :
               'bg-gradient-to-r from-red-900 to-red-800 text-red-100 border border-red-700')
        }`}>
          <TrendingUp className="h-6 w-6" />
          <div>
            <div className="font-bold text-lg">
              {goal === 'muscle_gain'
                ? (muscleGainEfficiency >= 70 ? 'עבודה מצוינת!' : muscleGainEfficiency >= 50 ? 'התקדמות טובה' : 'יש מקום לשיפור')
                : (fatLossEfficiency >= 80 ? 'עבודה מצוינת!' : fatLossEfficiency >= 60 ? 'התקדמות טובה' : 'יש מקום לשיפור')
              }
            </div>
            <div className="text-sm opacity-80">
              {goal === 'muscle_gain'
                ? (muscleGainEfficiency >= 70 ? 'בניית שריר איכותית והתקדמות מהירה' : 
                   muscleGainEfficiency >= 50 ? 'התקדמות יציבה, המשך כך' : 
                   'נדרש שיפור בתוכנית האימונים והתזונה')
                : (fatLossEfficiency >= 80 ? 'ירידה בשומן תוך שמירה על מסת שריר' : 
                   fatLossEfficiency >= 60 ? 'התקדמות טובה בהורדת שומן' : 
                   'יש לשפר את תוכנית האימונים והתזונה')
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};