import React, { useEffect, useState, useRef } from 'react';
import { Timer, FastForward } from 'lucide-react';
import Draggable from 'react-draggable';

interface RestTimerProps {
  time: number;
  onSkip: () => void;
  onComplete: () => void;
  isPaused: boolean;
}

export const RestTimer: React.FC<RestTimerProps> = ({ time, onSkip, onComplete, isPaused }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (time === 0) {
      onComplete();
    }
  }, [time, onComplete]);

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
      bounds="parent"
    >
      <div ref={nodeRef} className="fixed top-4 right-4 z-50 cursor-move">
        <div className="flex items-center gap-4 bg-gray-800 rounded-lg shadow-lg p-4 border-2 border-purple-700">
          <button
            onClick={onSkip}
            className="flex items-center gap-2 bg-purple-800 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 border border-purple-700"
          >
            <FastForward className="h-5 w-5 text-purple-300" />
            <span className="font-medium text-purple-200">דלג על מנוחה</span>
          </button>
          <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg border border-gray-600">
            <Timer className="h-5 w-5 text-amber-300" />
            <span className="font-medium text-amber-200">
              מנוחה: {formatTime(time)}
            </span>
          </div>
        </div>
      </div>
    </Draggable>
  );
};