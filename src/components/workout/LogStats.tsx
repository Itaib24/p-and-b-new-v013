import React from 'react';
import { WorkoutLog } from '../../types/workout';
import { Activity, Weight, Trophy } from 'lucide-react';

interface LogStatsProps {
  logs: WorkoutLog[];
}

export const LogStats: React.FC<LogStatsProps> = ({ logs }) => {
  const totalWorkouts = logs.length;
  const totalVolume = logs.reduce((total, log) => {
    return total + log.exercises.reduce((exerciseTotal, exercise) => {
      return exerciseTotal + exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps);
      }, 0);
    }, 0);
  }, 0);

  const averageVolume = totalWorkouts > 0 ? Math.round(totalVolume / totalWorkouts) : 0;

  return (
    <div className="grid grid-cols-2 gap-4" dir="rtl">
      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4 transform hover:-translate-y-1 border border-purple-700 group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-800 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <Activity className="h-5 w-5 text-purple-300" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-300">סך הכל אימונים</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-100 group-hover:scale-110 transition-transform duration-300">
                {totalWorkouts}
              </span>
              <Trophy className="h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4 transform hover:-translate-y-1 border border-green-700 group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-800 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <Weight className="h-5 w-5 text-green-300" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-300">נפח ממוצע לאימון</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-100 group-hover:scale-110 transition-transform duration-300">
                {averageVolume}
              </span>
              <span className="text-base font-medium text-gray-300 mr-1">ק״ג</span>
              <Trophy className="h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};