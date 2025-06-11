import React from 'react';
import { LogEntry } from '../workout/LogEntry';
import { LogStats } from '../workout/LogStats';
import { useWorkoutLog } from '../../contexts/WorkoutLogContext';

interface FirstWeekWorkoutsProps {
  userId: string;
}

export const FirstWeekWorkouts: React.FC<FirstWeekWorkoutsProps> = ({ userId }) => {
  const { getWorkoutLogs } = useWorkoutLog();
  const allLogs = getWorkoutLogs(userId);
  const firstWeekLogs = allLogs.slice(-7); // Get last 7 logs

  if (!firstWeekLogs || firstWeekLogs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto" dir="rtl">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md p-6 border-2 border-gray-700">
          <h2 className="text-xl font-bold text-gray-200 mb-4">שבוע ראשון</h2>
          <div className="text-center text-gray-400">
            לא נמצאו רישומי אימונים לשבוע הראשון.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md p-6 border-2 border-gray-700">
        <h2 className="text-xl font-bold text-gray-200 mb-4">שבוע ראשון</h2>
        <LogStats logs={firstWeekLogs} />
        <div className="space-y-6 mt-6">
          {firstWeekLogs.map((log, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-6 border border-gray-700">
              <LogEntry log={log} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};