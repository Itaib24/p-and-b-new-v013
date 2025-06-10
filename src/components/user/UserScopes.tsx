import React from 'react';
import { Ruler, ArrowUp, ArrowDown, Calendar, RefreshCw, EyeOff } from 'lucide-react';
import { BodyScope } from '../../types/scopes';
import { useUserScopeVisibility } from '../../contexts/UserScopeVisibilityContext';

interface UserScopesProps {
  userId: string;
  isTrainer?: boolean;
}

export const UserScopes: React.FC<UserScopesProps> = ({ userId, isTrainer = false }) => {
  const [showHistory, setShowHistory] = React.useState(false);
  const { isHiddenForUser, toggleVisibility } = useUserScopeVisibility();
  const [measurements, setMeasurements] = React.useState<BodyScope[]>([
    {
      date: new Date().toISOString().split('T')[0],
      waist: 82,
      legs: 58,
      frontArmRight: 35,
      frontArmLeft: 34,
      backArmRight: 37,
      backArmLeft: 36,
      shoulders: 120,
      chest: 98
    },
    {
      date: '2024-03-01',
      waist: 84,
      legs: 57,
      frontArmRight: 34,
      frontArmLeft: 33,
      backArmRight: 36,
      backArmLeft: 35,
      shoulders: 118,
      chest: 100
    }
  ]);

  // If this is a user view (not trainer) and scope is hidden for users, don't show anything
  if (!isTrainer && isHiddenForUser(userId)) {
    return null;
  }

  const currentMeasurement = measurements[0];
  const previousMeasurement = measurements[1];

  const getChange = (current: number, previous: number) => {
    return current - previous;
  };

  const getChangeColor = (change: number, isWaist: boolean = false) => {
    // For waist, negative change is good (losing inches)
    // For everything else, positive change is good (gaining muscle)
    if (isWaist) {
      return change < 0 ? 'text-green-400' : change > 0 ? 'text-red-400' : 'text-gray-400';
    } else {
      return change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400';
    }
  };

  const getChangeIcon = (change: number, isWaist: boolean = false) => {
    if ((isWaist && change < 0) || (!isWaist && change > 0)) {
      return <ArrowUp className="h-5 w-5 text-green-400" />;
    } else if ((isWaist && change > 0) || (!isWaist && change < 0)) {
      return <ArrowDown className="h-5 w-5 text-red-400" />;
    } else {
      return <span className="h-5 w-5">•</span>;
    }
  };

  const renderMeasurementCard = (title: string, value: number, prevValue: number, unit: string = 'ס״מ', isWaist: boolean = false) => {
    const change = getChange(value, prevValue);
    const emoji = isWaist ? 
      (change < 0 ? "👍" : change > 0 ? "🤔" : "➖") : 
      (change > 0 ? "💪" : change < 0 ? "📉" : "➖");

    return (
      <div className="bg-purple-800 rounded-xl shadow-sm p-4 border-2 border-purple-700 hover:shadow-md transition-all duration-200">
        <div className="text-center mb-2">
          <span className="text-xl font-bold">{emoji}</span>
          <h4 className="text-base font-semibold text-gray-200">{title}</h4>
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <div className="text-center">
            <div className="text-sm text-gray-400">לפני</div>
            <div className="text-lg font-bold text-purple-400">{prevValue} {unit}</div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            {getChangeIcon(change, isWaist)}
            <span className={`text-sm font-bold ${getChangeColor(change, isWaist)}`}>
              {Math.abs(change)}
            </span>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-400">עכשיו</div>
            <div className="text-lg font-bold text-purple-300">{value} {unit}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-sm border-2 border-purple-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-900 shadow-sm">
            <Ruler className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-200">המדידות שלי</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Add visibility toggle button - only visible for trainers */}
          {isTrainer && (
            <button
              onClick={() => toggleVisibility(userId)}
              className="flex items-center gap-2 px-4 py-2 bg-red-900 text-red-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-2 border-red-800"
              title={isHiddenForUser(userId) ? "הצג מדידות למשתמש" : "הסתר מדידות ממשתמש"}
            >
              <EyeOff className="h-5 w-5" />
              <span className="font-medium">{isHiddenForUser(userId) ? "מוסתר ממשתמש" : "הסתר ממשתמש"}</span>
            </button>
          )}
          
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-900 text-purple-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-2 border-purple-800"
          >
            {showHistory ? (
              <>
                <RefreshCw className="h-5 w-5" />
                <span className="font-medium">מצב נוכחי</span>
              </>
            ) : (
              <>
                <Calendar className="h-5 w-5" />
                <span className="font-medium">היסטוריה</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!showHistory ? (
        <div className="space-y-8">
          {/* Body Parts Visualization */}
          <div className="relative bg-purple-900/30 rounded-xl p-6 shadow-sm border-2 border-purple-800">
            <h4 className="text-lg font-semibold text-center mb-6 text-gray-200">איך אני משתפר? 📏</h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {renderMeasurementCard("חזה", currentMeasurement.chest, previousMeasurement.chest)}
              {renderMeasurementCard("כתפיים", currentMeasurement.shoulders, previousMeasurement.shoulders)}
              {renderMeasurementCard("מותן", currentMeasurement.waist, previousMeasurement.waist, "ס״מ", true)}
              {renderMeasurementCard("רגליים", currentMeasurement.legs, previousMeasurement.legs)}
              {renderMeasurementCard("זרוע ימין", currentMeasurement.frontArmRight, previousMeasurement.frontArmRight)}
              {renderMeasurementCard("זרוע שמאל", currentMeasurement.frontArmLeft, previousMeasurement.frontArmLeft)}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center mb-4 bg-purple-900/30 rounded-xl py-3 shadow-sm border-2 border-purple-800">
            <h4 className="text-lg font-semibold text-gray-200">היסטוריית מדידות 📅</h4>
          </div>
          
          {measurements.map((measurement, index) => (
            <div key={measurement.date} className="bg-purple-900/30 rounded-xl p-6 shadow-sm border-2 border-purple-800">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-purple-700">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  <span className="font-semibold text-gray-200">{measurement.date}</span>
                </div>
                {index === 0 && (
                  <span className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                    הכי חדש! 🌟
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-center text-sm font-medium text-gray-400 mb-2">פלג גוף עליון</div>
                  <div className="space-y-2 bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-300">חזה:</span>
                      <span className="font-medium text-purple-300">{measurement.chest} ס״מ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">כתפיים:</span>
                      <span className="font-medium text-purple-300">{measurement.shoulders} ס״מ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">זרוע ימין:</span>
                      <span className="font-medium text-purple-300">{measurement.frontArmRight} ס״מ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">זרוע שמאל:</span>
                      <span className="font-medium text-purple-300">{measurement.frontArmLeft} ס״מ</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-center text-sm font-medium text-gray-400 mb-2">פלג גוף תחתון</div>
                  <div className="space-y-2 bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-300">מותן:</span>
                      <span className="font-medium text-purple-300">{measurement.waist} ס״מ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">רגליים:</span>
                      <span className="font-medium text-purple-300">{measurement.legs} ס״מ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};