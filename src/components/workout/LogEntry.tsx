import React from 'react';
import { WorkoutLog } from '../../types/workout';
import { Calendar, Clock, AlertCircle, Dumbbell, Trophy } from 'lucide-react';

interface LogEntryProps {
  log: WorkoutLog;
}

export const LogEntry: React.FC<LogEntryProps> = ({ log }) => {
  return (
    <div className="transform hover:-translate-y-1 transition-all duration-300" dir="rtl">
      {/* Log Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
            <Dumbbell className="h-6 w-6 text-purple-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-200">{log.type}</h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{log.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{log.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Exercises */}
      <div className="space-y-4">
        {log.exercises.map((exercise, exIdx) => (
          <div 
            key={exIdx} 
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h4 className="font-medium text-gray-200">{exercise.name}</h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {exercise.sets.map((set, setIdx) => (
                <div 
                  key={setIdx} 
                  className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 rounded-lg border border-gray-600 hover:border-purple-700 transition-colors duration-200 transform hover:scale-102"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-400">סט {setIdx + 1}</span>
                    <span className="text-sm font-semibold text-gray-200">
                      {set.weight} ק״ג × {set.reps}
                    </span>
                  </div>
                  {set.notes && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-amber-300 bg-amber-900/40 px-2 py-1 rounded-full border border-amber-800/50">
                      <AlertCircle className="h-3 w-3" />
                      <span>{set.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Notes */}
      {log.notes && (
        <div className="mt-4 flex items-start gap-2 bg-gradient-to-r from-amber-900/30 to-gray-800 border-r-4 border-amber-700 p-3 rounded-l-lg transform hover:scale-102 transition-transform duration-200">
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-300">{log.notes}</p>
        </div>
      )}
    </div>
  );
};