import React, { useState } from 'react';
import { messages } from '../data/messages';
import { ChatWindow } from '../plugins/Chat';
import { Header } from './layout/Header';
import { TabNavigation } from './tabs/TabNavigation';
import { Overview } from './tabs/Overview';
import { MealPlan } from './tabs/MealPlan';
import { Training } from './tabs/Training';
import { WorkoutLogs } from './tabs/WorkoutLogs';
import { FirstWeekWorkouts } from './tabs/FirstWeekWorkouts';
import { UsersOverview } from './tabs/UsersOverview';
import { AdminPanel } from './users/AdminPanel';
import { Dumbbell, MessageSquare, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { getOverviewById } from '../data/overview';

function App() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [chatMessages, setChatMessages] = useState(messages);
  const [engagementRate, setEngagementRate] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showLeftPanel, setShowLeftPanel] = useState(false);

  const handleSendMessage = (message: string) => {
    const newMessage = {
      time: new Date().toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      text: message,
    };
    setChatMessages([...chatMessages, newMessage]);
  };

  const handleEngagementRateChange = (rate: number) => {
    setEngagementRate(rate);
  };

  const handleUserSelect = (userId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedUserId(userId);
      setActiveTab("overview");
      setIsTransitioning(false);
    }, 200);
  };

  const handleBackToUsers = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedUserId(null);
      setActiveTab("overview");
      setIsTransitioning(false);
    }, 200);
  };

  const getTransitionClasses = () => {
    if (!isTransitioning) return 'scale-100 opacity-100';
    return 'scale-98 opacity-0';
  };

  if (!selectedUserId) {
    return (
      <div 
        className={`h-screen bg-gray-900 font-sans transition-all duration-200 ease-out transform-gpu ${getTransitionClasses()}`}
      >
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-200">Raeda-AI</span>
            </div>
            <h1 className="text-xl font-bold text-gray-200">Users Overview</h1>
          </div>
        </div>
        <div className="p-6">
          <UsersOverview onUserSelect={handleUserSelect} />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`h-screen bg-gray-900 font-sans transition-all duration-200 ease-out transform-gpu ${getTransitionClasses()}`}
    >
      {/* Mobile Toggle Navigation */}
      <div className="md:hidden bg-gray-800 text-white flex items-center justify-around border-b border-gray-700">
        <button
          onClick={() => setShowChat(true)}
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors duration-200 ${
            showChat ? 'bg-gray-700' : ''
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
        </button>
        <button
          onClick={() => setShowChat(false)}
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors duration-200 ${
            !showChat ? 'bg-gray-700' : ''
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span>Progress</span>
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        {/* Left Panel Toggle Button */}
        <button
          onClick={() => setShowLeftPanel(!showLeftPanel)}
          className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-purple-600 text-white px-6 py-4 rounded-r-xl shadow-lg hover:bg-purple-700 transition-all duration-300 group flex items-center gap-3 ${
            showLeftPanel ? 'translate-x-[22rem]' : 'translate-x-0'
          } relative before:absolute before:inset-0 before:rounded-r-xl before:bg-purple-400/20 before:animate-pulse before:blur-md before:-z-10 after:absolute after:inset-0 after:rounded-r-xl after:bg-purple-600/20 after:animate-pulse after:blur-lg after:-z-20`}
          title={showLeftPanel ? 'Close Chat' : 'Open Chat'}
        >
          {showLeftPanel ? (
            <>
              <PanelLeftClose className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-base font-medium">Close Chat</span>
            </>
          ) : (
            <>
              <PanelLeftOpen className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-base font-medium">Open Chat</span>
            </>
          )}
        </button>

        {/* Main Content Container */}
        <div className="flex w-full h-full relative">
          {/* Left Panel - Chat and user info */}
          <div 
            className={`fixed left-0 top-0 bottom-0 w-[22rem] bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out transform ${
              showLeftPanel ? 'translate-x-0' : '-translate-x-full'
            } z-40 shadow-2xl`}
          >
            <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Raeda-AI</span>
              </div>
            </div>
            <Header userId={selectedUserId} />
            <ChatWindow 
              messages={chatMessages} 
              onSendMessage={handleSendMessage}
              onEngagementRateChange={handleEngagementRateChange}
            />
          </div>

          {/* Right Panel - User details */}
          <div 
            className={`w-full flex flex-col transition-all duration-300 ${
              showLeftPanel ? 'ml-[22rem]' : 'ml-0'
            }`}
          >
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center">
              <button
                onClick={handleBackToUsers}
                className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-2"
              >
                ← Back to Users
              </button>
            </div>
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
              {activeTab === "overview" && (
                <Overview 
                  engagementRate={engagementRate} 
                  userOverview={getOverviewById(selectedUserId)} 
                  isTrainerView={true}
                />
              )}
              {activeTab === "mealplan" && <MealPlan />}
              {activeTab === "training" && <Training userId={selectedUserId} />}
              {activeTab === "workoutlogs" && <WorkoutLogs />}
              {activeTab === "firstweek" && <FirstWeekWorkouts userId={selectedUserId} />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-full">
        {/* Mobile Chat Panel */}
        <div className={`h-full ${!showChat ? 'hidden' : ''}`}>
          <Header userId={selectedUserId} />
          <ChatWindow 
            messages={chatMessages} 
            onSendMessage={handleSendMessage}
            onEngagementRateChange={handleEngagementRateChange}
          />
        </div>

        {/* Mobile Progress Panel */}
        <div className={`h-full ${showChat ? 'hidden' : ''}`}>
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center">
            <button
              onClick={handleBackToUsers}
              className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-2"
            >
              ← Back to Users
            </button>
          </div>
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="p-6 bg-gray-900">
            {activeTab === "overview" && (
              <Overview 
                engagementRate={engagementRate} 
                userOverview={getOverviewById(selectedUserId)}
                isTrainerView={true}
              />
            )}
            {activeTab === "mealplan" && <MealPlan />}
            {activeTab === "training" && <Training userId={selectedUserId} />}
            {activeTab === "workoutlogs" && <WorkoutLogs />}
            {activeTab === "firstweek" && <FirstWeekWorkouts userId={selectedUserId} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;