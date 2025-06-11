import React, { useState } from 'react';
import { TrainingDay } from '../../types/training';
import { TrainingDayEditor } from '../training/TrainingDayEditor';
import { Dumbbell, Save, FolderOpen, AlertCircle, Check, X, Plus, Info } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useWorkoutPlanTemplate } from '../../contexts/WorkoutPlanTemplateContext';
import { WorkoutPlanTemplateManager } from '../training/WorkoutPlanTemplateManager';
import { ClientAdjustmentButton, AdjustmentHistoryButton } from '../trainer/ClientAdjustmentButton';

interface TrainingProps {
  userId: string;
}

export const Training: React.FC<TrainingProps> = ({ userId }) => {
  const { getUserTrainingPlan, updateTrainingPlan } = useAdmin();
  const { savePlanTemplate } = useWorkoutPlanTemplate();
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const trainingPlan = getUserTrainingPlan(userId) || [];

  const handleDayAdd = (index?: number) => {
    const newDay: TrainingDay = {
      day: 'יום חדש',
      focus: 'מיקוד חדש',
      exercises: []
    };
    
    if (typeof index === 'number') {
      const newPlan = [...trainingPlan];
      newPlan.splice(index + 1, 0, newDay);
      updateTrainingPlan(userId, newPlan);
    } else {
      updateTrainingPlan(userId, [...trainingPlan, newDay]);
    }
  };

  const handleDayUpdate = (index: number, updatedDay: TrainingDay) => {
    const newPlan = [...trainingPlan];
    newPlan[index] = updatedDay;
    updateTrainingPlan(userId, newPlan);
  };

  const handleDayDelete = (index: number) => {
    updateTrainingPlan(userId, trainingPlan.filter((_, i) => i !== index));
  };

  const handleSavePlanTemplate = () => {
    if (!templateName.trim()) return;
    
    savePlanTemplate(
      templateName, 
      JSON.parse(JSON.stringify(trainingPlan)), // Deep copy
      templateDescription
    );
    
    setShowSaveModal(false);
    setTemplateName('');
    setTemplateDescription('');
    setShowSaveSuccess(true);
    
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  const handleSelectTemplate = (template: { id: string; name: string; plan: TrainingDay[] }) => {
    updateTrainingPlan(userId, JSON.parse(JSON.stringify(template.plan))); // Deep copy
    setShowTemplatesModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="relative">
        {/* Success Message */}
        {showSaveSuccess && (
          <div className="fixed top-4 right-1/2 transform translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 border-2 border-green-500 animate-fade-in-up">
            <Check className="h-5 w-5" />
            <span className="font-medium">התוכנית נשמרה בהצלחה!</span>
          </div>
        )}

        {/* Header Card */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 mb-8 border-b-4 border-purple-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-900 shadow-md">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">תוכנית אימונים שבועית</h2>
                <p className="text-purple-200">ניהול ימי אימון ותרגילים</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Client adjustment button */}
              <ClientAdjustmentButton 
                userId={userId}
                userName=""
              />
              
              {/* Adjustment history */}
              <AdjustmentHistoryButton
                userId={userId}
                hasHistory={false} // Set to true when there's history
              />
              
              <div className="flex bg-gray-800/80 p-1.5 rounded-xl shadow-md border border-gray-700/60">
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="text-sm p-1.5 px-3 text-white bg-purple-700 hover:bg-purple-600 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-1.5" 
                  title="שמור כתבנית"
                >
                  <Save className="h-4 w-4" />
                  <span>שמור</span>
                </button>
                <button
                  onClick={() => setShowTemplatesModal(true)}
                  className="text-sm p-1.5 px-3 ml-1 text-white bg-blue-700 hover:bg-blue-600 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-1.5"
                  title="טען תבנית"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>טען</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Guidance tooltip */}
          <div className="mt-6 bg-gray-800/70 rounded-xl p-4 border-2 border-purple-700/30 flex items-center gap-3 shadow-lg">
            <Info className="h-5 w-5 text-white flex-shrink-0" />
            <p className="text-white text-sm">
              לחץ על <span className="font-bold bg-purple-900/80 px-2 py-1 rounded-lg">הוסף יום אימון</span> כדי להתחיל לבנות את התוכנית.
              לחץ על <span className="font-bold bg-purple-900/80 px-2 py-1 rounded-lg">התאמת תוכנית</span> כדי לבצע התאמות מדויקות לתוכנית הקיימת, כולל שינוי משקלים, חזרות וסטים.
            </p>
          </div>
        </div>

        {/* Workout Days Container */}
        <div className="space-y-12">
          {/* No workouts state */}
          {trainingPlan.length === 0 ? (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-lg p-8 border-2 border-dashed border-purple-500 flex flex-col items-center justify-center gap-6 transition-transform duration-300 hover:scale-[1.02]">
              <div className="p-5 bg-gradient-to-r from-purple-700 to-purple-600 rounded-full shadow-xl">
                <Dumbbell className="h-10 w-10 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-2xl text-white mb-3">אין ימי אימון עדיין</h3>
                <p className="text-gray-300 mb-6 max-w-md mx-auto">יש להוסיף ימי אימון כדי להתחיל לבנות את התוכנית האישית של המתאמן</p>
                <button
                  onClick={() => handleDayAdd()}
                  className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium text-lg rounded-xl px-8 py-4 shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto border-b-4 border-purple-800"
                >
                  <Plus className="h-6 w-6" />
                  <span>הוסף יום אימון</span>
                </button>
              </div>
            </div>
          ) : (
            // Workout days list
            <div className="space-y-12">
              {trainingPlan.map((day, index) => (
                <TrainingDayEditor
                  key={index}
                  day={day}
                  onUpdate={(updatedDay) => handleDayUpdate(index, updatedDay)}
                  onDelete={() => handleDayDelete(index)}
                  onAddDay={() => handleDayAdd(index)}
                />
              ))}
              
              {/* Add button */}
              <button
                onClick={() => handleDayAdd()}
                className="w-full py-4 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl shadow-lg hover:from-purple-500 hover:to-purple-600 transition-all duration-300 text-lg border-b-4 border-purple-900"
              >
                <Plus className="h-6 w-6" />
                <span>הוסף יום אימון חדש</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save Plan Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl max-w-md w-full mx-4 shadow-2xl border-2 border-purple-500 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg">
                  <Save className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">שמירת תוכנית אימונים</h3>
              </div>
              <p className="text-gray-300 text-sm">שמור את התוכנית הנוכחית כתבנית לשימוש חוזר</p>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">שם התוכנית:</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="לדוגמה: תוכנית פיתוח שרירים"
                  className="w-full p-3 border border-gray-600 bg-gray-700/60 rounded-xl text-white focus:border-purple-500 focus:ring focus:ring-purple-500/30 transition-all duration-200 placeholder-gray-400 text-base shadow-inner"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">תיאור התוכנית:</label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="תאר את מטרות התוכנית..."
                  className="w-full p-3 border border-gray-600 bg-gray-700/60 rounded-xl h-24 text-white focus:border-purple-500 focus:ring focus:ring-purple-500/30 transition-all duration-200 placeholder-gray-400 text-base shadow-inner resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end pt-4 gap-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-6 py-3 text-gray-300 hover:text-white transition-colors duration-200 text-base font-medium"
                >
                  ביטול
                </button>
                <button
                  onClick={handleSavePlanTemplate}
                  disabled={!templateName.trim() || trainingPlan.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium shadow-lg border-b-2 border-green-800"
                >
                  שמור תוכנית
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Manager Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <div className="max-w-5xl w-full max-h-[90vh]">
            <WorkoutPlanTemplateManager 
              onClose={() => setShowTemplatesModal(false)}
              onSelectTemplate={handleSelectTemplate}
            />
          </div>
        </div>
      )}
    </div>
  );
};