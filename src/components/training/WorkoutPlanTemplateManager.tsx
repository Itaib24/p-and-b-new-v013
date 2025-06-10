import React, { useState } from 'react';
import { useWorkoutPlanTemplate } from '../../contexts/WorkoutPlanTemplateContext';
import { Save, X, Edit2, Trash2, Copy, Search, Clock, Calendar, Check, Users, CalendarDays, Info, Star, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { TrainingDay } from '../../types/training';

interface WorkoutPlanTemplateManagerProps {
  onClose: () => void;
  onSelectTemplate: (template: { id: string; name: string; plan: TrainingDay[] }) => void;
}

export const WorkoutPlanTemplateManager: React.FC<WorkoutPlanTemplateManagerProps> = ({ 
  onClose,
  onSelectTemplate 
}) => {
  const { planTemplates, deletePlanTemplate, updatePlanTemplate } = useWorkoutPlanTemplate();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<{ id: string; name: string; description?: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveEdit = (id: string, newName: string, description?: string) => {
    if (!newName.trim()) return;
    
    const template = planTemplates.find(t => t.id === id);
    if (!template) return;
    
    setIsLoading(true);
    
    // Simulate loading for better user experience
    setTimeout(() => {
      updatePlanTemplate(id, newName, template.plan, description);
      setEditingTemplate(null);
      setIsLoading(false);
    }, 500);
  };

  const handleDeleteConfirm = (id: string) => {
    setIsLoading(true);
    
    // Simulate loading for better user experience
    setTimeout(() => {
      deletePlanTemplate(id);
      setShowDeleteConfirm(null);
      setIsLoading(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric' 
    });
  };

  const filteredTemplates = planTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (template.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Fun emoji for each plan based on its id
  const getTemplateEmoji = (id: string) => {
    const emojis = ["🏋️", "💪", "🏆", "🥇", "⚡", "🔥", "🚀", "⭐"];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return emojis[hash % emojis.length];
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col border-2 border-purple-500">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800 p-6 border-b border-purple-600 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl shadow-lg animate-pulse-slow">
            <CalendarDays className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">תבניות אימון שבועיות</h3>
            <p className="text-purple-200">בחר תוכנית אימונים מוכנה</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 hover:bg-purple-600/40 rounded-xl transition-colors duration-200 text-white"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Search with better UX */}
      <div className="p-6 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <input
            type="text"
            placeholder="חפש תבנית אימון..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-4 border-2 border-gray-700 bg-gray-800/60 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-white text-lg placeholder-gray-400"
            dir="rtl"
          />
        </div>
      </div>

      {/* Template Cards - Modern Design */}
      <div className="overflow-y-auto flex-grow p-6 bg-gradient-to-b from-gray-900/20 to-gray-900/60 backdrop-blur-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <Loader className="h-10 w-10 text-purple-500 animate-spin mb-4" />
              <p className="text-gray-300 text-lg">טוען...</p>
            </div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Calendar className="h-12 w-12 text-gray-500" />
            </div>
            <h4 className="text-2xl font-bold text-gray-300 mb-3">אין תבניות עדיין</h4>
            <p className="text-gray-400 max-w-md mx-auto">
              {searchTerm 
                ? 'לא נמצאו תוכניות אימון התואמות לחיפוש' 
                : 'שמור תוכנית אימונים כדי שתופיע כאן לשימוש חוזר'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map(template => (
              <div 
                key={template.id}
                className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-600/60 hover:border-purple-500 relative transform hover:-translate-y-1"
              >
                {editingTemplate?.id === template.id ? (
                  // Edit mode - improved UX
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-gradient-to-r from-purple-700 to-purple-600 rounded-xl shadow-md">
                        <Edit2 className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white">עריכת תבנית</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">שם תבנית:</label>
                      <input
                        type="text"
                        value={editingTemplate.name}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                        className="w-full p-3 border-2 border-purple-500 bg-gray-700/60 rounded-xl text-lg font-medium text-white focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 shadow-inner"
                        autoFocus
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">תיאור (לא חובה):</label>
                      <textarea
                        value={editingTemplate.description || ''}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                        className="w-full p-3 border-2 border-purple-500 bg-gray-700/60 rounded-xl h-24 text-white focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 shadow-inner resize-none"
                      />
                    </div>
                    
                    <div className="flex justify-center gap-4 pt-2">
                      <button
                        onClick={() => handleSaveEdit(template.id, editingTemplate.name, editingTemplate.description)}
                        disabled={!editingTemplate.name.trim() || isLoading}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-300 shadow-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 border-b-2 border-green-900"
                      >
                        {isLoading ? (
                          <>
                            <Loader className="h-5 w-5 animate-spin" />
                            <span>שומר...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-5 w-5" />
                            <span>שמור שינויים</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setEditingTemplate(null)}
                        disabled={isLoading}
                        className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 rounded-xl hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode - visually appealing
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-700 to-purple-600 rounded-xl shadow-md transform hover:rotate-12 transition-transform duration-300 w-14 h-14 flex items-center justify-center text-2xl">
                        {getTemplateEmoji(template.id)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl font-bold text-white">{template.name}</h4>
                          <div className="bg-purple-900/70 px-3 py-1 rounded-full text-sm font-medium text-purple-200 border border-purple-700/50">
                            {template.plan.length} ימים
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(template.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {template.description && (
                      <div className="bg-gradient-to-r from-gray-700/60 to-gray-800/60 p-4 rounded-xl mb-5 shadow-md border border-gray-600/40 flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300">{template.description}</p>
                      </div>
                    )}

                    {/* Show days count with visual indicator */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <CalendarDays className="h-5 w-5 text-purple-400" />
                        <span className="font-medium">ימי אימון בתוכנית:</span>
                      </div>
                      
                      <div className="flex items-center">
                        {template.plan.map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-2.5 h-2.5 rounded-full ${i < 5 ? 'mx-0.5' : ''} ${
                              i === 0 ? 'bg-purple-500' :
                              i === 1 ? 'bg-blue-500' :
                              i === 2 ? 'bg-green-500' :
                              i === 3 ? 'bg-yellow-500' :
                              i === 4 ? 'bg-red-500' :
                              'hidden'
                            }`}
                          />
                        ))}
                        {template.plan.length > 5 && (
                          <span className="text-xs text-gray-400 ml-1">+{template.plan.length - 5}</span>
                        )}
                      </div>
                    </div>

                    {/* Toggle Details Button */}
                    <button
                      onClick={() => setExpandedTemplateId(expandedTemplateId === template.id ? null : template.id)}
                      className="w-full bg-gray-700/60 hover:bg-gray-600/60 rounded-xl py-3 mb-4 text-gray-300 transition-colors duration-200 flex items-center justify-center gap-2 shadow-md border border-gray-600/40"
                    >
                      <span>
                        {expandedTemplateId === template.id ? 'הסתר פרטים' : 'הצג פרטים'}
                      </span>
                      {expandedTemplateId === template.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {/* Plan Summary - shown on expand */}
                    <div className={`space-y-2 mb-4 ${expandedTemplateId === template.id ? 'block animate-fade-in-up' : 'hidden'}`}>
                      {template.plan.map((day, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-gray-700/60 to-gray-800/60 p-4 rounded-xl border border-gray-600/40 hover:border-purple-600/50 transition-all duration-300 shadow-md">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-900/60 text-purple-300 font-semibold">
                                {idx+1}
                              </div>
                              <div className="font-medium text-white">{day.day}: {day.focus}</div>
                            </div>
                            <div className="flex items-center gap-1.5 bg-purple-900/60 px-2.5 py-1 rounded-lg text-sm text-purple-200 border border-purple-800/40">
                              <Dumbbell className="h-3.5 w-3.5" />
                              <span>{day.exercises.length}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {/* Edit button */}
                        <button 
                          onClick={() => setEditingTemplate({ 
                            id: template.id, 
                            name: template.name,
                            description: template.description
                          })}
                          className="p-2.5 rounded-xl bg-amber-600/80 text-white hover:bg-amber-500 transition-colors duration-200 shadow-md"
                          title="ערוך"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        {/* Delete button */}
                        <button 
                          onClick={() => setShowDeleteConfirm(template.id)}
                          className="p-2.5 rounded-xl bg-red-600/80 text-white hover:bg-red-500 transition-colors duration-200 shadow-md"
                          title="מחק"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {/* Use Button */}
                      <button
                        onClick={() => onSelectTemplate(template)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center gap-2 border-b-2 border-purple-900 transform hover:scale-105"
                      >
                        <Copy className="h-5 w-5" />
                        <span>השתמש בתוכנית</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Delete Confirmation - with animation */}
                {showDeleteConfirm === template.id && (
                  <div className="absolute inset-0 bg-gray-900/95 rounded-xl flex flex-col items-center justify-center p-6 z-10 animate-fade-in-up backdrop-blur-sm">
                    <div className="bg-red-600 p-4 rounded-full mb-5 shadow-lg">
                      <Trash2 className="h-8 w-8 text-white" />
                    </div>
                    <h5 className="text-center font-bold text-2xl text-white mb-3">למחוק את התוכנית?</h5>
                    <p className="text-center text-gray-300 mb-6 max-w-xs">אתה עומד למחוק את תבנית התוכנית. פעולה זו אינה ניתנת לביטול.</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleDeleteConfirm(template.id)}
                        disabled={isLoading}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-500 hover:to-red-400 transition-all duration-300 font-medium shadow-lg disabled:opacity-70 disabled:cursor-not-allowed border-b-2 border-red-900 flex items-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader className="h-5 w-5 animate-spin" />
                            <span>מוחק...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-5 w-5" />
                            <span>כן, מחק</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        disabled={isLoading}
                        className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 rounded-xl hover:from-gray-600 hover:to-gray-500 transition-all duration-300 font-medium shadow-lg disabled:opacity-70 disabled:cursor-not-allowed border-b-2 border-gray-900"
                      >
                        <span>ביטול</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Help Footer */}
      {filteredTemplates.length > 0 && !isLoading && (
        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-700 border-t border-gray-700">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <Info className="h-4 w-4 text-blue-400" />
            <p>טיפ: ניתן לערוך תבנית קיימת או ליצור חדשה ע״י שמירת יום אימון.</p>
          </div>
        </div>
      )}
    </div>
  );
};