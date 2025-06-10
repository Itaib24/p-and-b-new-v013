import React from 'react';
import { RoadmapLevel } from './RoadmapLevel';
import { RoadmapPath } from '../../types/roadmap';
import { Trophy, Target, Star } from 'lucide-react';

interface ProgressRoadmapProps {
  path: RoadmapPath;
}

export const ProgressRoadmap: React.FC<ProgressRoadmapProps> = ({ path }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-blue-100 transform hover:rotate-12 transition-transform duration-300">
            <Trophy className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">מפת דרכים להתקדמות</h2>
            <p className="text-gray-600 mt-1">
              {path.type === 'fat_loss' ? 'מסע הירידה במשקל' : 'מסע בניית השריר'} שלך
            </p>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-800">התקדמות כוללת</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-600">14%</div>
              <div className="text-sm text-gray-500">שלב 1/7</div>
            </div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '14%' }} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-800">אבני דרך שהושגו</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-purple-600">1</div>
              <div className="text-sm text-gray-500">מתוך 7</div>
            </div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full animate-pulse" style={{ width: '14%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Road Path Container */}
      <div className="relative min-h-[2400px] px-16">
        {/* Winding Road Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main Curved Road Path */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              {/* Road Gradient */}
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E5E7EB" />
                <stop offset="50%" stopColor="#F3F4F6" />
                <stop offset="100%" stopColor="#E5E7EB" />
              </linearGradient>
              
              {/* Road Edge Gradient */}
              <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0" />
              </linearGradient>

              {/* Road Texture Pattern */}
              <pattern id="roadTexture" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="#4B5563" fillOpacity="0.1" />
              </pattern>
            </defs>

            {/* Road Base Layer */}
            <path
              d="M 500,0 
                 Q 700,300 300,600 
                 Q 100,900 500,1200 
                 Q 900,1500 300,1800 
                 Q 100,2100 500,2400"
              fill="none"
              stroke="url(#roadGradient)"
              strokeWidth="120"
              className="drop-shadow-lg"
            />

            {/* Road Edges */}
            <path
              d="M 500,0 
                 Q 700,300 300,600 
                 Q 100,900 500,1200 
                 Q 900,1500 300,1800 
                 Q 100,2100 500,2400"
              fill="none"
              stroke="url(#edgeGradient)"
              strokeWidth="122"
              strokeLinecap="round"
            />

            {/* Road Texture */}
            <path
              d="M 500,0 
                 Q 700,300 300,600 
                 Q 100,900 500,1200 
                 Q 900,1500 300,1800 
                 Q 100,2100 500,2400"
              fill="url(#roadTexture)"
              strokeWidth="120"
              className="opacity-30"
            />

            {/* Animated Center Line */}
            <path
              d="M 500,0 
                 Q 700,300 300,600 
                 Q 100,900 500,1200 
                 Q 900,1500 300,1800 
                 Q 100,2100 500,2400"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeDasharray="20,20"
              className="animate-roadMove"
              strokeLinecap="round"
            />

            {/* Road Highlights */}
            <path
              d="M 500,0 
                 Q 700,300 300,600 
                 Q 100,900 500,1200 
                 Q 900,1500 300,1800 
                 Q 100,2100 500,2400"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeOpacity="0.3"
              strokeDasharray="4,16"
              className="animate-roadMove"
              style={{ animationDuration: '2s' }}
            />
          </svg>
        </div>

        {/* Levels Container */}
        <div className="relative">
          {path.levels.map((level, index) => {
            const yPosition = (index * 340) + 40; // Increased vertical spacing
            const xOffset = index % 2 === 0 ? -320 : 320; // Increased horizontal spacing
            
            return (
              <div
                key={level.level}
                className="absolute transform transition-all duration-500 hover:scale-105"
                style={{
                  top: `${yPosition}px`,
                  left: '50%',
                  transform: `translateX(${xOffset}px)`
                }}
              >
                {/* Connecting Line */}
                {index > 0 && (
                  <div
                    className={`absolute ${index % 2 === 0 ? 'right-full' : 'left-full'} top-1/2 w-[200px] h-[3px] transform -translate-y-1/2
                      ${level.unlocked 
                        ? 'bg-gradient-to-r from-green-500 to-transparent' 
                        : 'bg-gradient-to-r from-gray-300 to-transparent'
                      }
                      ${index % 2 === 0 ? 'rounded-r-full' : 'rounded-l-full'}
                    `}
                  >
                    {/* Animated Dots */}
                    {level.unlocked && (
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                      </div>
                    )}
                  </div>
                )}

                <RoadmapLevel
                  level={level}
                  isLast={index === path.levels.length - 1}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};