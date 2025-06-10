import React, { useState } from 'react';
import { TrainerView } from './views/TrainerView';
import { UserView } from './views/UserView';
import { AdminView } from './views/AdminView';
import { Dumbbell, Users, Shield } from 'lucide-react';
import { MealPlanProvider } from './contexts/MealPlanContext';
import { WorkoutLogProvider } from './contexts/WorkoutLogContext';
import { AdminProvider } from './contexts/AdminContext';
import { WorkoutTemplateProvider } from './contexts/WorkoutTemplateContext';
import { WorkoutPlanTemplateProvider } from './contexts/WorkoutPlanTemplateContext';
import { UserScopeVisibilityProvider } from './contexts/UserScopeVisibilityContext';
import { ProgressProvider } from './contexts/ProgressTrackingContext';

function App() {
  const [view, setView] = useState<'select' | 'trainer' | 'user' | 'admin'>('select');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <AdminProvider>
      <MealPlanProvider>
        <WorkoutLogProvider>
          <WorkoutTemplateProvider>
            <WorkoutPlanTemplateProvider>
              <ProgressProvider>
                <UserScopeVisibilityProvider>
                  {view === 'trainer' ? (
                    <TrainerView onBackToSelect={() => setView('select')} />
                  ) : view === 'user' && selectedUserId ? (
                    <UserView userId={selectedUserId} onBackToSelect={() => setView('select')} />
                  ) : view === 'admin' ? (
                    <AdminView onBackToSelect={() => setView('select')} />
                  ) : (
                    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                      <div className="max-w-3xl w-full space-y-8">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-gray-200 mb-2">ראדה-AI</h1>
                          <p className="text-lg text-gray-400">בחר תצוגה</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <button
                            onClick={() => setView('admin')}
                            className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-purple-700 group"
                          >
                            <div className="flex flex-col items-center gap-4">
                              <div className="p-4 rounded-xl bg-purple-900 transform group-hover:rotate-12 transition-transform duration-300">
                                <Shield className="h-8 w-8 text-white" />
                              </div>
                              <div className="text-center">
                                <h2 className="text-xl font-semibold text-gray-200 mb-2">תצוגת מנהל</h2>
                                <p className="text-gray-400 text-sm">ניהול מאמנים וניתוח מערכת</p>
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={() => setView('trainer')}
                            className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-purple-700 group"
                          >
                            <div className="flex flex-col items-center gap-4">
                              <div className="p-4 rounded-xl bg-purple-900 transform group-hover:rotate-12 transition-transform duration-300">
                                <Users className="h-8 w-8 text-white" />
                              </div>
                              <div className="text-center">
                                <h2 className="text-xl font-semibold text-gray-200 mb-2">תצוגת מאמן</h2>
                                <p className="text-gray-400 text-sm">ניהול מתאמנים, תוכניות אימון ותזונה</p>
                              </div>
                            </div>
                          </button>

                          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border-2 border-purple-700">
                            <div className="flex flex-col items-center gap-4">
                              <div className="p-4 rounded-xl bg-purple-900">
                                <Dumbbell className="h-8 w-8 text-white" />
                              </div>
                              <div className="text-center">
                                <h2 className="text-xl font-semibold text-gray-200 mb-2">תצוגת מתאמן</h2>
                                <p className="text-gray-400 text-sm mb-4">צפייה בתוכניות ורישום אימונים</p>
                                <select
                                  className="w-full p-2 border-2 border-gray-700 bg-gray-800 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 text-gray-200"
                                  value={selectedUserId || ''}
                                  onChange={(e) => setSelectedUserId(e.target.value)}
                                >
                                  <option value="">בחר משתמש</option>
                                  <option value="1">איתי בלסקי</option>
                                  <option value="2">שרה כהן</option>
                                  <option value="3">דוד לוי</option>
                                </select>
                                <button
                                  onClick={() => selectedUserId && setView('user')}
                                  disabled={!selectedUserId}
                                  className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  כניסה
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </UserScopeVisibilityProvider>
              </ProgressProvider>
            </WorkoutPlanTemplateProvider>
          </WorkoutTemplateProvider>
        </WorkoutLogProvider>
      </MealPlanProvider>
    </AdminProvider>
  );
}

export default App;