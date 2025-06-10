import React from 'react';
import { RoadmapLevel as RoadmapLevelType } from '../../types/roadmap';
import { Trophy, Star, Clock, ChevronRight, Lock, CheckCircle, User } from 'lucide-react';

interface RoadmapLevelProps {
  level: RoadmapLevelType;
  isLast: boolean;
}

export const RoadmapLevel: React.FC<RoadmapLevelProps> = ({ level, isLast }) => {
  return (
    <div className={`relative ${!isLast ? 'mb-8' : ''}`}>
      {/* Character Animation */}
      {level.currentLevel && (
        <div className="absolute -top-12 -right-8 animate-bounce">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-25 animate-ping" />
            <div className="relative bg-white p-2 rounded-full shadow-lg border-2 border-blue-500">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      )}

      <div 
        className={`
          relative bg-white rounded-xl shadow-lg p-6 border-2 
          ${level.unlocked 
            ? level.currentLevel 
              ? 'border-blue-400 ring-4 ring-blue-100 animate-pulse'
              : 'border-green-200 hover:border-green-300' 
            : 'border-gray-200 opacity-75'
          }
          transform hover:scale-102 transition-all duration-300
          ${level.currentLevel ? 'z-10' : 'z-0'}
        `}
      >
        {/* Level Badge */}
        <div className={`
          absolute -top-3 -right-3 
          ${level.currentLevel 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 animate-pulse' 
            : 'bg-gradient-to-br from-gray-500 to-gray-600'
          } 
          text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg
        `}>
          {level.level}
        </div>

        {/* Lock/Unlock Icon with Animation */}
        <div className="absolute -top-3 -left-3">
          {level.unlocked ? (
            <div className="bg-green-100 p-2 rounded-full transform hover:rotate-12 transition-all duration-300">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          ) : (
            <div className="bg-gray-100 p-2 rounded-full transform hover:shake transition-all duration-300">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        {!isLast && (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-1 h-8">
            <div className={`
              w-full h-full rounded-full
              ${level.unlocked 
                ? 'bg-gradient-to-b from-green-500 to-transparent' 
                : 'bg-gradient-to-b from-gray-300 to-transparent'
              }
            `} />
          </div>
        )}

        <div className="space-y-4">
          {/* Header with Trophy Animation */}
          <div className="flex items-center gap-3">
            <div className={`
              p-3 rounded-xl 
              ${level.currentLevel 
                ? 'bg-blue-100 animate-pulse' 
                : 'bg-gray-100'
              } 
              transform group-hover:rotate-12 transition-transform duration-300
            `}>
              <Trophy className={`
                h-6 w-6 
                ${level.currentLevel 
                  ? 'text-blue-600 animate-bounce' 
                  : 'text-gray-500'
                }
              `} />
            </div>
            <div>
              <h3 className={`
                text-lg font-semibold 
                ${level.currentLevel 
                  ? 'text-blue-900' 
                  : 'text-gray-800'
                }
              `}>
                {level.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{level.timeframe}</span>
              </div>
            </div>
          </div>

          {/* Visual Evolution with Animation */}
          <div className={`
            bg-gray-50 rounded-lg p-4 transform transition-all duration-300
            ${level.currentLevel ? 'hover:scale-102 hover:bg-blue-50' : ''}
          `}>
            <p className="text-gray-700">{level.visualEvolution}</p>
          </div>

          {/* Notification with Star Animation */}
          <div className={`
            flex items-start gap-2 p-4 rounded-lg 
            ${level.currentLevel 
              ? 'bg-blue-50 text-blue-800' 
              : level.unlocked 
                ? 'bg-green-50 text-green-800'
                : 'bg-gray-50 text-gray-600'
            }
          `}>
            <Star className={`
              w-5 h-5 flex-shrink-0 mt-0.5
              ${level.currentLevel ? 'animate-spin-slow' : ''}
            `} />
            <p className="text-sm">{level.notification}</p>
          </div>

          {/* Next Step Indicator with Animation */}
          {level.currentLevel && (
            <div className="flex items-center justify-end gap-2 text-sm font-medium text-blue-600 animate-pulse">
              <span>השלב הבא</span>
              <ChevronRight className="w-4 h-4 animate-bounce-x" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};