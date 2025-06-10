import React, { useState, useEffect } from 'react';
import { ChevronRight, Layout, Calendar, Dumbbell, ClipboardList, Map } from 'lucide-react';
import { Overview } from '../components/tabs/Overview';
import { UserMealPlan } from '../components/user/UserMealPlan';
import { UserWorkoutPlan } from '../components/user/UserWorkoutPlan';
import { WorkoutLogger } from '../components/user/WorkoutLogger';
import { RestTimer } from '../components/workout/RestTimer';
import { ProgressRoadmap } from '../components/roadmap/ProgressRoadmap';
import { getOverviewById } from '../data/overview';
import { WorkoutProvider } from '../contexts/WorkoutContext';
import { fatLossPath, muscleGainPath } from '../types/roadmap';

interface UserViewProps {
  userId: string;
  onBackToSelect: () => void;
}

export const UserView: React.FC<UserViewProps> = ({ userId, onBackToSelect }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [engagementRate, setEngagementRate] = useState(0);
  const [isWorkoutInProgress, setIsWorkoutInProgress] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const userOverview = getOverviewById(userId);

  const tabs = [
    { id: "overview", label: "סקירה כללית", icon: Layout },
    { id: "meal-plan", label: "תוכנית תזונה", icon: Calendar },
    { id: "workout-plan", label: "תוכנית אימונים", icon: Dumbbell },
    { id: "workout-logger", label: "יומן אימונים", icon: ClipboardList },
    { id: "roadmap", label: "מפת התקדמות", icon: Map }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restTimer > 0 && !isPaused) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer, isPaused]);

  useEffect(() => {
    if (restTimer === 0 && isWorkoutInProgress && activeTab !== "workout-logger") {
      if (Notification.permission === "granted") {
        const notification = new Notification("זמן המנוחה הסתיים!", {
          body: "חזור לאימון כדי להמשיך",
          icon: "/vite.svg"
        });

        notification.onclick = () => {
          setActiveTab("workout-logger");
          window.focus();
        };
      }
    }
  }, [restTimer, isWorkoutInProgress, activeTab]);

  useEffect(() => {
    if (isWorkoutInProgress && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [isWorkoutInProgress]);

  const handleWorkoutStart = () => {
    setIsWorkoutInProgress(true);
  };

  const handleWorkoutEnd = () => {
    setIsWorkoutInProgress(false);
    setRestTimer(0);
    setIsPaused(false);
  };

  const handleRestStart = (duration: number) => {
    setRestTimer(duration);
  };

  const handleRestSkip = () => {
    setRestTimer(0);
  };

  const handleRestComplete = () => {
    if (activeTab !== "workout-logger") {
      if (Notification.permission === "granted") {
        new Notification("זמן המנוחה הסתיים!", {
          body: "חזור לאימון כדי להמשיך",
          icon: "/vite.svg"
        });
      }
    }
  };

  const handlePauseToggle = (paused: boolean) => {
    setIsPaused(paused);
  };

  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-gray-900 relative">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-4 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToSelect}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5" />
              חזרה לבחירת תצוגה
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 blur"></div>
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                  className="relative h-8 w-8 rounded-full border border-purple-500"
                />
              </div>
              <span className="font-medium text-gray-200">{userOverview.userName}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 flex gap-1" dir="rtl">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                p-3 text-sm font-semibold uppercase transition-all duration-200 rounded-lg
                flex items-center gap-2 group
                ${activeTab === id
                  ? "bg-gradient-to-r from-purple-700 to-purple-800 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                }
              `}
            >
              <Icon className={`w-4 h-4 ${
                activeTab === id 
                  ? "text-purple-300 transform group-hover:rotate-12 transition-transform duration-300" 
                  : "text-gray-500 group-hover:text-purple-400 transform group-hover:rotate-12 transition-all duration-300"
              }`} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 bg-gray-900">
          {activeTab === "overview" && (
            <Overview 
              engagementRate={engagementRate} 
              userOverview={userOverview} 
              isTrainerView={false}
            />
          )}
          {activeTab === "meal-plan" && (
            <UserMealPlan userId={userId} />
          )}
          {activeTab === "workout-plan" && (
            <UserWorkoutPlan userId={userId} />
          )}
          {activeTab === "workout-logger" && (
            <WorkoutLogger 
              userId={userId}
              onWorkoutStart={handleWorkoutStart}
              onWorkoutEnd={handleWorkoutEnd}
              onRestStart={handleRestStart}
              onPauseToggle={handlePauseToggle}
              restTimer={restTimer}
              isPaused={isPaused}
            />
          )}
          {activeTab === "roadmap" && (
            <ProgressRoadmap path={userOverview.goal === 'fat_loss' ? fatLossPath : muscleGainPath} />
          )}
        </div>

        {/* Floating Rest Timer */}
        {isWorkoutInProgress && restTimer > 0 && activeTab !== "workout-logger" && (
          <RestTimer
            time={restTimer}
            onSkip={handleRestSkip}
            onComplete={handleRestComplete}
            isPaused={isPaused}
          />
        )}
      </div>
    </WorkoutProvider>
  );
};