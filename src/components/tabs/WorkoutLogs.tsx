import React from 'react';
import { LogEntry } from '../workout/LogEntry';
import { LogStats } from '../workout/LogStats';
import { ClipboardList } from 'lucide-react';
import { useWorkoutLog } from '../../contexts/WorkoutLogContext';

interface WorkoutLogsProps {
  userId?: string;
}

export const WorkoutLogs: React.FC<WorkoutLogsProps> = ({ userId = '1' }) => {
  const { getWorkoutLogs } = useWorkoutLog();
  const logs = getWorkoutLogs(userId);

  if (!logs || logs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto" dir="rtl">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-sm overflow-hidden border-2 border-gray-700">
          <div className="border-b border-gray-700 bg-gray-800 p-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-gray-200">היסטוריית אימונים</h2>
            </div>
          </div>
          <div className="p-6 text-center text-gray-400">
            לא נמצאו רישומי אימונים.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-sm overflow-hidden border-2 border-gray-700">
        <div className="border-b border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-gray-200">היסטוריית אימונים</h2>
          </div>
        </div>

        <div className="p-6">
          <LogStats logs={logs} />
          
          <div className="mt-8 space-y-6">
            {logs.map((log, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-6 first:mt-0 border border-gray-700">
                <LogEntry log={log} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};