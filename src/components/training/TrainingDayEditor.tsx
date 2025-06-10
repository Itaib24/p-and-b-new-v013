import React, { useState } from 'react';
import { TrainingDay, Exercise, ExerciseOption } from '../../types/training';
import { ExerciseEditor } from './ExerciseEditor';
import { ExerciseSelector } from './ExerciseSelector';
import { Calendar, ChevronDown, ChevronUp, Edit2, Check, X, Plus, Trash2, Save, FolderOpen, AlertCircle, Info, Clock, ArrowRight } from 'lucide-react';
import { useWorkoutTemplate } from '../../contexts/WorkoutTemplateContext';
import { WorkoutTemplateManager } from './WorkoutTemplateManager';

interface TrainingDayEditorProps {
  day: TrainingDay;
  onUpdate: (updatedDay: TrainingDay) => void;
  onDelete: () => void;
  onAddDay?: () => void;
}

export const TrainingDayEditor: React.FC<TrainingDayEditorProps> = ({
  day,
  onUpdate,
  onDelete,
  onAddDay
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDay, setEditedDay] = useState(day.day);
  const [editedFocus, setEditedFocus] = useState(day.focus);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showTemplatesManager, setShowTemplatesManager] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [showTemplateSuccess, setShowTemplateSuccess] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);
  const [expandedExerciseIndex, setExpandedExerciseIndex] = useState<number | null>(null);
  const { saveTemplate } = useWorkoutTemplate();

  const handleExerciseAdd = (exercise: ExerciseOption) => {
    const newExercise: Exercise = {
      name: exercise.name,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      rest: exercise.defaultRest,
      instructions: exercise.instructions
    };

    const newExercises = [...day.exercises];
    if (selectedExerciseIndex !== null) {
      newExercises.splice(selectedExerciseIndex + 1, 0, newExercise);
    } else {
      newExercises.push(newExercise);
    }

    onUpdate({
      ...day,
      exercises: newExercises
    });
    setShowExerciseSelector(false);
    setSelectedExerciseIndex(null);
  };

  const handleExerciseUpdate = (index: number, updatedExercise: Exercise) => {
    const newExercises = [...day.exercises];
    newExercises[index] = updatedExercise;
    onUpdate({
      ...day,
      exercises: newExercises
    });
  };

  const handleExerciseDelete = (index: number) => {
    onUpdate({
      ...day,
      exercises: day.exercises.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    onUpdate({
      ...day,
      day: editedDay,
      focus: editedFocus
    });
    setIsEditing(false);
  };

  const handleSaveAsTemplate = () => {
    if (!templateName.trim()) return;
    
    saveTemplate(templateName, {
      ...day,
      day: editedDay,
      focus: editedFocus
    });
    setShowSaveTemplateModal(false);
    setTemplateName('');
    setTemplateDescription('');
    setShowTemplateSuccess(true);
    
    setTimeout(() => {
      setShowTemplateSuccess(false);
    }, 3000);
  };

  const handleSelectTemplate = (template: { id: string; name: string; day: TrainingDay }) => {
    onUpdate({
      ...template.day,
      day: day.day,  // Preserve current day name
      focus: template.day.focus
    });
    setShowTemplatesManager(false);
  };

  const toggleExerciseExpand = (index: number) => {
    if (expandedExerciseIndex === index) {
      setExpandedExerciseIndex(null);
    } else {
      setExpandedExerciseIndex(index);
    }
  };

  return (
    <div className="relative">
      {/* Main card with animated shadow */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden border-2 border-purple-500/70 hover:border-purple-500 transition-all duration-300 group transform hover:-translate-y-1">
        {/* Success message */}
        {showTemplateSuccess && (
          <div className="absolute top-3 right-1/2 transform translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 border-2 border-green-500 animate-fade-in-up">
            <Check className="h-5 w-5" />
            <span className="font-medium">התבנית נשמרה בהצלחה!</span>
          </div>
        )}

        {/* Header section */}
        <div className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 p-5 border-b border-gray-600/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {/* Day info */}
            {isEditing ? (
              <div className="flex gap-3 items-center flex-1 bg-gray-800/80 p-4 rounded-xl border border-gray-600/60">
                <div className="flex-1 flex gap-4 items-center">
                  <input
                    type="text"
                    value={editedDay}
                    onChange={(e) => setEditedDay(e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-purple-500 rounded-xl text-lg font-semibold bg-gray-700/80 text-white shadow-inner focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all duration-200"
                    placeholder="יום"
                    autoFocus
                  />
                  <span className="text-xl text-gray-300">-</span>
                  <input
                    type="text"
                    value={editedFocus}
                    onChange={(e) => setEditedFocus(e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-purple-500 rounded-xl text-lg font-semibold bg-gray-700/80 text-white shadow-inner focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all duration-200"
                    placeholder="מיקוד"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      className="p-2 rounded-xl bg-green-600 text-white hover:bg-green-500 transition-colors duration-200 shadow-md"
                      title="שמור שינויים"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedDay(day.day);
                        setEditedFocus(day.focus);
                      }}
                      className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors duration-200 shadow-md"
                      title="בטל שינויים"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-purple-700 to-purple-600 rounded-xl shadow-md transform group-hover:scale-105 transition-transform duration-300">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{day.day} - {day.focus}</h3>
                  <div className="flex items-center text-sm text-gray-300 mt-1">
                    <Info className="h-4 w-4 mr-1.5" />
                    <span>{day.exercises.length} תרגילים</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-white transition-colors duration-200 shadow-md ml-2"
                  title="ערוך יום"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-700/80 p-1.5 rounded-xl shadow-md border border-gray-600/40">
                <button
                  onClick={() => setShowSaveTemplateModal(true)}
                  className="text-sm p-1.5 px-3 text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-1.5" 
                  title="שמור כתבנית"
                >
                  <Save className="h-4 w-4" />
                  <span>שמור</span>
                </button>
                <button
                  onClick={() => setShowTemplatesManager(true)}
                  className="text-sm p-1.5 px-3 ml-1 text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-1.5"
                  title="טען תבנית"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>טען</span>
                </button>
              </div>
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2.5 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white rounded-xl shadow-md transition-all duration-200 transform group-hover:scale-105"
              >
                {isExpanded ? 
                  <ChevronUp className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
              </button>
            </div>
          </div>
          
          {/* Exercise info and help text */}
          {day.exercises.length > 0 && isExpanded && (
            <div className="mt-4 bg-purple-900/30 p-3 rounded-xl border border-purple-700/30 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-purple-300 flex-shrink-0" />
              <p className="text-sm text-purple-200">
                לחץ על שם תרגיל כדי לעדוך את הפרטים שלו. ניתן להוסיף תרגיל חדש בכל מקום ברשימה.
              </p>
            </div>
          )}
        </div>

        {/* Exercise List - REDESIGNED */}
        {isExpanded && (
          <div className="p-6 bg-gradient-to-b from-gray-800/70 to-gray-900/90 backdrop-blur-sm">
            {day.exercises.length === 0 ? (
              <div className="py-10 bg-gray-800/40 rounded-2xl border-2 border-dashed border-purple-500/50 flex flex-col items-center justify-center gap-5">
                <div className="p-4 bg-gradient-to-r from-purple-700 to-purple-600 rounded-full shadow-xl transform hover:rotate-12 transition-transform duration-500">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-xl text-purple-200 mb-2">אין תרגילים עדיין</h3>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">הוסף תרגילים כדי לבנות את יום האימון</p>
                  <button
                    onClick={() => {
                      setSelectedExerciseIndex(null);
                      setShowExerciseSelector(true);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl py-3 px-6 font-medium shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto border-b-2 border-purple-900"
                  >
                    <Plus className="h-5 w-5" />
                    <span>הוסף תרגיל ראשון</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Exercise List Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-800/80 rounded-xl text-gray-300 text-sm font-medium border border-gray-700/50">
                  <div className="col-span-5 flex items-center">
                    <span className="ml-2">#</span>
                    <span>תרגיל</span>
                  </div>
                  <div className="col-span-2 text-center">סטים</div>
                  <div className="col-span-2 text-center">חזרות</div>
                  <div className="col-span-2 text-center">מנוחה</div>
                  <div className="col-span-1 text-center">פעולות</div>
                </div>
                
                {/* Exercise Items - Better Styling */}
                <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden shadow-lg">                  
                  <div className="divide-y divide-gray-700/50">
                    {day.exercises.map((exercise, index) => (
                      <div key={index} className="group/exercise">
                        <div 
                          className={`py-4 px-4 hover:bg-gray-700/40 transition-colors duration-200 ${
                            expandedExerciseIndex === index ? 'bg-gray-700/60' : ''
                          }`}
                        >
                          <div className="grid grid-cols-12 gap-2 items-center">
                            <div 
                              className="col-span-5 font-medium text-white flex items-center gap-2 cursor-pointer"
                              onClick={() => toggleExerciseExpand(index)}
                            >
                              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-900/60 text-purple-200 font-semibold">
                                {index + 1}
                              </div>
                              <div className="flex items-center gap-1.5 ml-1">
                                {expandedExerciseIndex === index ? (
                                  <ChevronUp className="h-4 w-4 text-purple-400" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="truncate">{exercise.name}</span>
                              </div>
                            </div>
                            
                            {/* Better visual indicators for exercise details */}
                            <div className="col-span-2 text-center">
                              <div className="bg-purple-900/70 rounded-lg py-1.5 px-3 text-white text-sm font-medium border border-purple-700/50">
                                {exercise.sets.replace(' sets', '').trim()}
                              </div>
                            </div>
                            
                            <div className="col-span-2 text-center">
                              <div className="bg-green-900/70 rounded-lg py-1.5 px-3 text-white text-sm font-medium border border-green-700/50">
                                {exercise.reps.replace(' reps', '').trim()}
                              </div>
                            </div>
                            
                            <div className="col-span-2 text-center">
                              <div className="bg-blue-900/70 rounded-lg py-1.5 px-3 text-white text-sm font-medium flex items-center justify-center gap-1.5 border border-blue-700/50">
                                <Clock className="h-3.5 w-3.5" />
                                {exercise.rest.replace(' seconds rest', '').trim()}
                              </div>
                            </div>
                            
                            <div className="col-span-1 flex justify-end">
                              <button
                                onClick={() => setExpandedExerciseIndex(index)}
                                className="p-1.5 bg-amber-600/80 hover:bg-amber-500/90 text-white rounded-lg shadow-sm transition-all duration-200"
                                title="ערוך"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded Exercise View */}
                        {expandedExerciseIndex === index && (
                          <div className="p-5 bg-gradient-to-b from-gray-700/60 to-gray-800/60 border-t border-gray-600/50">
                            <ExerciseEditor
                              exercise={exercise}
                              onUpdate={(updatedExercise) => handleExerciseUpdate(index, updatedExercise)}
                              onDelete={() => handleExerciseDelete(index)}
                            />
                          </div>
                        )}
                        
                        {/* Add exercise between exercises button */}
                        <div className="h-0 relative flex justify-center opacity-0 group-hover/exercise:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => {
                              setSelectedExerciseIndex(index);
                              setShowExerciseSelector(true);
                            }}
                            className="absolute -bottom-3 z-10 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white py-1.5 px-3 rounded-full
                              shadow-lg text-sm flex items-center gap-1.5 font-medium border-b-2 border-purple-800 transform hover:scale-105 transition-all duration-200"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>הוסף תרגיל</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Add exercise at the end - better styled button */}
                <button
                  onClick={() => {
                    setSelectedExerciseIndex(null);
                    setShowExerciseSelector(true);
                  }}
                  className="w-full py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg transition-all duration-300 border-b-2 border-purple-900"
                >
                  <Plus className="h-5 w-5" />
                  <span>הוסף תרגיל חדש</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Workout Day Button - Redesigned */}
      {onAddDay && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={onAddDay}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full shadow-lg hover:from-purple-500 hover:to-purple-400 transition-all duration-300 font-medium border-b-2 border-purple-900 transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>הוסף יום אימון</span>
          </button>
        </div>
      )}
      
      {/* Redesigned Delete Button */}
      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="absolute -top-3 -right-3 p-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full shadow-lg hover:from-red-500 hover:to-red-400 z-10 transition-all duration-200 transform hover:scale-110 border-b-2 border-red-900"
        title="מחק יום אימון"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      {/* Exercise Selector Modal - Redesigned */}
      {showExerciseSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in-up backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl border-2 border-purple-500">
            <div className="p-5 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-purple-700 to-purple-600 rounded-xl shadow-md">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">בחירת תרגיל</h3>
                  <p className="text-gray-300 text-sm">הוסף תרגיל חדש לתוכנית האימון</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowExerciseSelector(false);
                  setSelectedExerciseIndex(null);
                }}
                className="p-2 hover:bg-red-600/80 rounded-full transition-colors duration-200 text-gray-300 hover:text-white"
                title="סגור"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-5 max-h-[70vh] overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto pr-2">
                <ExerciseSelector onExerciseSelect={handleExerciseAdd} />
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700/50 text-center">
                <button
                  onClick={() => {
                    setShowExerciseSelector(false);
                    setSelectedExerciseIndex(null);
                  }}
                  className="px-6 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200"
                >
                  סגירה
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Redesigned */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in-up backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl max-w-md w-full mx-4 shadow-2xl border-2 border-red-500 overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-red-700 to-red-600 rounded-xl shadow-md">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">מחיקת יום אימון</h3>
            </div>
            
            <div className="p-8">
              <div className="bg-red-900/30 rounded-xl p-4 mb-8 border border-red-800/30 flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-red-100 font-medium mb-1">אזהרה!</p>
                  <p className="text-red-200">האם אתה בטוח שברצונך למחוק את יום האימון? פעולה זו אינה הפיכה ותמחק את כל התרגילים המשוייכים ליום זה.</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 shadow-md font-medium"
                >
                  ביטול
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowDeleteConfirm(false);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl transition-colors duration-200 shadow-lg font-medium border-b-2 border-red-900"
                >
                  כן, מחק
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save As Template Modal - Redesigned */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in-up backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl max-w-md w-full mx-4 shadow-2xl border-2 border-purple-500 overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-700 to-purple-600 rounded-xl shadow-md">
                <Save className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">שמירה כתבנית</h3>
                <p className="text-gray-300 text-sm">שמור את יום האימון לשימוש חוזר</p>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-base font-medium text-gray-200">שם התבנית:</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="תבנית חדשה"
                  className="w-full p-3 border border-gray-600 bg-gray-700/60 rounded-xl text-white focus:border-purple-500 focus:ring focus:ring-purple-500/30 transition-colors duration-200 placeholder-gray-400 text-base shadow-inner"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-gray-200">תיאור (לא חובה):</label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="תיאור קצר..."
                  className="w-full p-3 border border-gray-600 bg-gray-700/60 rounded-xl h-24 text-white focus:border-purple-500 focus:ring focus:ring-purple-500/30 transition-colors duration-200 placeholder-gray-400 text-base shadow-inner resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowSaveTemplateModal(false)}
                  className="px-6 py-3 text-gray-300 hover:text-white transition-colors text-base font-medium"
                >
                  ביטול
                </button>
                <button
                  onClick={handleSaveAsTemplate}
                  disabled={!templateName.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium shadow-lg border-b-2 border-purple-900"
                >
                  שמירה
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Manager Modal */}
      {showTemplatesManager && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in-up backdrop-blur-sm">
          <div className="max-w-4xl w-full max-h-[90vh]">
            <WorkoutTemplateManager 
              onClose={() => setShowTemplatesManager(false)}
              onSelectTemplate={handleSelectTemplate}
            />
          </div>
        </div>
      )}
    </div>
  );
};