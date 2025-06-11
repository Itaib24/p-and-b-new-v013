import React, { useState, useEffect } from 'react';
import MealEditor from '../meal/MealEditor';
import { MacroDisplay } from '../meal/MacroDisplay';
import { MacroRange, MealCategory } from '../../types/food';
import { Utensils, Plus, Trash2, Eye, EyeOff, Save, FileDown, Check, Info, AlertCircle } from 'lucide-react';
import { useMealPlan } from '../../contexts/MealPlanContext';

export const MealPlanPage: React.FC = () => {
  const [meals, setMeals] = useState<{
    id: string;
    name: string;
    categories: MealCategory[];
    macroRange: MacroRange;
  }[]>([]);

  const [totalMacroRange, setTotalMacroRange] = useState<MacroRange>({
    min: { protein: 0, carbs: 0, fats: 0, calories: 0 },
    max: { protein: 0, carbs: 0, fats: 0, calories: 0 }
  });

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTemplateSelectionModal, setShowTemplateSelectionModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [showSaveToExistingSuccess, setShowSaveToExistingSuccess] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const { 
    initializeMealPlan, 
    getMealPlanForUser, 
    toggleHideMacros,
    saveAsTemplate,
    loadTemplate,
    mealTemplates 
  } = useMealPlan();

  const mealPlan = getMealPlanForUser('1');

  useEffect(() => {
    initializeMealPlan('1');
    const userMealPlan = getMealPlanForUser('1');
    
    if (userMealPlan) {
      const initialMeals = userMealPlan.meals.map(meal => ({
        id: meal.id,
        name: meal.meal,
        categories: meal.categories,
        macroRange: {
          min: { protein: 0, carbs: 0, fats: 0, calories: 0 },
          max: { protein: 0, carbs: 0, fats: 0, calories: 0 }
        }
      }));
      setMeals(initialMeals);
    }
  }, [initializeMealPlan, getMealPlanForUser]);

  const handleMealAdd = (index?: number) => {
    const newMeal = {
      id: `meal-${Date.now()}`,
      name: `ארוחה ${meals.length + 1}`,
      categories: [],
      macroRange: {
        min: { protein: 0, carbs: 0, fats: 0, calories: 0 },
        max: { protein: 0, carbs: 0, fats: 0, calories: 0 }
      }
    };
    
    if (typeof index === 'number') {
      const newMeals = [...meals];
      newMeals.splice(index + 1, 0, newMeal);
      setMeals(newMeals);
    } else {
      setMeals([...meals, newMeal]);
    }
  };

  const handleMealUpdate = (id: string, categories: MealCategory[], macroRange: MacroRange) => {
    const newMeals = meals.map(meal => 
      meal.id === id ? { ...meal, categories, macroRange } : meal
    );
    setMeals(newMeals);
    updateTotalMacros(newMeals);
  };

  const handleMealDelete = (id: string) => {
    const newMeals = meals.filter(meal => meal.id !== id);
    setMeals(newMeals);
    updateTotalMacros(newMeals);
  };

  const updateTotalMacros = (updatedMeals: typeof meals) => {
    const newTotalMacroRange: MacroRange = {
      min: { protein: 0, carbs: 0, fats: 0, calories: 0 },
      max: { protein: 0, carbs: 0, fats: 0, calories: 0 }
    };

    updatedMeals.forEach(meal => {
      newTotalMacroRange.min.protein += meal.macroRange.min.protein;
      newTotalMacroRange.min.carbs += meal.macroRange.min.carbs;
      newTotalMacroRange.min.fats += meal.macroRange.min.fats;
      newTotalMacroRange.min.calories += meal.macroRange.min.calories;

      newTotalMacroRange.max.protein += meal.macroRange.max.protein;
      newTotalMacroRange.max.carbs += meal.macroRange.max.carbs;
      newTotalMacroRange.max.fats += meal.macroRange.max.fats;
      newTotalMacroRange.max.calories += meal.macroRange.max.calories;
    });

    setTotalMacroRange(newTotalMacroRange);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    
    saveAsTemplate(templateName, mealPlan?.meals || []);
    setShowTemplateModal(false);
    setShowTemplateSelectionModal(false);
    setTemplateName('');
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleSaveToExisting = () => {
    if (!selectedTemplateId) return;
    
    saveAsTemplate(
      mealTemplates.find(t => t.id === selectedTemplateId)?.name || '',
      mealPlan?.meals || []
    );
    setShowTemplateSelectionModal(false);
    setSelectedTemplateId('');
    setShowSaveToExistingSuccess(true);
    setTimeout(() => setShowSaveToExistingSuccess(false), 3000);
  };

  const handleSaveClick = () => {
    if (mealTemplates.length > 0) {
      setShowTemplateSelectionModal(true);
    } else {
      setShowTemplateModal(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      {/* Header Card with Actions */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-900 rounded-2xl shadow-xl p-6 border-2 border-purple-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-900 transform hover:rotate-12 transition-transform duration-300">
              <Utensils className="h-6 w-6 text-purple-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">תוכנית תזונה יומית</h2>
              <p className="text-purple-200 mt-1">תכנון ארוחות ומאקרו</p>
            </div>
          </div>

          {/* Help button */}
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 flex items-center gap-1"
          >
            <Info className="h-4 w-4" /> 
            <span>עזרה</span>
          </button>
        </div>

        {/* Help panel */}
        {showHelp && (
          <div className="mb-6 bg-purple-900/40 rounded-xl p-4 border border-purple-800 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white mb-1">הוראות שימוש:</h4>
                <ul className="space-y-2 text-purple-200 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-400 mt-0.5">1.</span>
                    <span>לחץ על <span className="bg-purple-900 px-2 py-0.5 rounded-full text-purple-200 font-bold">+ הוסף ארוחה</span> כדי להתחיל תוכנית תזונה חדשה.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-400 mt-0.5">2.</span>
                    <span>בחר פריטי מזון לכל ארוחה מקטגוריות: חלבונים, פחמימות או אחר.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-400 mt-0.5">3.</span>
                    <span>כוון את הכמות (בגרמים) לכל מזון לפי הצורך.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-400 mt-0.5">4.</span>
                    <span>שמור את התוכנית כתבנית לשימוש חוזר.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons in an easy to understand grid layout */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Templates Dropdown - simplified with better label */}
          <div className="relative p-4 bg-purple-900 rounded-lg border-2 border-purple-800 hover:border-purple-700 transition-all duration-200">
            <label className="block text-sm font-medium text-purple-200 mb-2">בחר תבנית קיימת</label>
            <div className="relative">
              <select
                className="w-full p-2 pr-4 pl-10 border-2 border-purple-700 rounded-lg appearance-none bg-gray-800 text-gray-200 focus:border-purple-600 focus:ring focus:ring-purple-700 focus:ring-opacity-50 cursor-pointer shadow-sm hover:shadow transition-all duration-200"
                onChange={(e) => {
                  if (e.target.value !== 'no-template') {
                    loadTemplate(e.target.value, '1');
                  }
                }}
                defaultValue="no-template"
              >
                <option value="no-template" className="font-medium text-gray-400 bg-gray-700">
                  🔄 עבודה ללא תבנית
                </option>
                <optgroup label="תבניות קיימות" className="font-medium text-gray-200 bg-gray-800">
                  {mealTemplates.map(template => (
                    <option key={template.id} value={template.id} className="font-medium text-gray-200 bg-gray-800">
                      📋 {template.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <FileDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400 pointer-events-none" />
            </div>
            <p className="mt-2 text-xs text-purple-300">טען תבנית תזונה קיימת לעריכה</p>
          </div>

          {/* Save Template Button - better visual design */}
          <div className="p-4 bg-green-900 rounded-lg border-2 border-green-800 hover:border-green-700 transition-all duration-200">
            <div className="mb-2">
              <span className="text-sm font-medium text-green-200">שמור תבנית חדשה</span>
            </div>
            <button
              onClick={handleSaveClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm hover:shadow"
            >
              <Save className="h-5 w-5" />
              <span>שמור תוכנית כתבנית</span>
            </button>
            <p className="mt-2 text-xs text-green-300">שמור את התוכנית הנוכחית לשימוש חוזר</p>
          </div>

          {/* Hide/Show Macros Button - with clear explanation */}
          <div className="col-span-2 p-4 bg-gray-800 rounded-lg border-2 border-purple-800 hover:border-purple-700 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-purple-300 mb-1 block">הסתרת מאקרו למתאמן</span>
                <p className="text-xs text-purple-400">הסתר/הצג את פירוט המאקרו בתצוגת המתאמן</p>
              </div>
              <button
                onClick={() => toggleHideMacros('1')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm ${
                  mealPlan?.hideMacros 
                    ? 'bg-red-700 text-white hover:bg-red-600'
                    : 'bg-purple-700 text-white hover:bg-purple-600'
                }`}
              >
                {mealPlan?.hideMacros ? (
                  <>
                    <Eye className="h-5 w-5" />
                    <span>הצג מאקרו</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-5 w-5" />
                    <span>הסתר מאקרו</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Success messages styled as more prominent banners */}
        {showSaveSuccess && (
          <div className="mb-4 p-4 bg-green-900 text-green-200 rounded-lg flex items-center gap-3 border-2 border-green-700 shadow-sm">
            <div className="p-2 bg-green-800 rounded-full">
              <Check className="h-5 w-5" />
            </div>
            <span className="font-medium">התבנית החדשה נשמרה בהצלחה!</span>
          </div>
        )}

        {showSaveToExistingSuccess && (
          <div className="mb-4 p-4 bg-green-900 text-green-200 rounded-lg flex items-center gap-3 border-2 border-green-700 shadow-sm">
            <div className="p-2 bg-green-800 rounded-full">
              <Check className="h-5 w-5" />
            </div>
            <span className="font-medium">התבנית עודכנה בהצלחה!</span>
          </div>
        )}

        {/* Total Macros - with clearer title and styling */}
        <div className="mb-4">
          <div className="mb-2">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <span className="p-1 rounded-full bg-purple-900">
                <Info className="h-5 w-5 text-purple-400" />
              </span>
              סיכום מאקרו יומי
            </h3>
          </div>
          <MacroDisplay
            macroRange={totalMacroRange}
            title="סה״כ מאקרו יומי"
          />
        </div>
      </div>

      {/* Meals Container - Now completely outside the header card */}
      <div className="space-y-8">
        {/* No meals state - more prominent call to action */}
        {meals.length === 0 && (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 border-2 border-dashed border-purple-700 hover:border-purple-500 transition-all duration-300 flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-purple-700 text-white rounded-full shadow-lg">
              <Plus className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">התחל בתכנון תזונה</h3>
              <p className="text-gray-400 mb-4">לחץ על הכפתור כדי ליצור ארוחה ראשונה בתוכנית</p>
              <button
                onClick={() => handleMealAdd()}
                className="px-6 py-3 bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-500 transition-colors duration-200 flex items-center gap-2 mx-auto shadow-lg border-b-4 border-purple-900"
              >
                <Plus className="h-5 w-5" />
                <span>הוסף ארוחה ראשונה</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Meal Cards - individual cards like training days */}
        {meals.map((meal, index) => (
          <div key={meal.id} className="relative mb-12 group/meal">
            {/* Delete button */}
            <button
              onClick={() => handleMealDelete(meal.id)}
              className="absolute -top-3 -right-3 p-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full shadow-lg hover:from-red-500 hover:to-red-400 z-10 transition-all duration-200 transform hover:scale-110 border-b-2 border-red-900"
              title="מחק ארוחה"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            
            {/* Meal Editor Component */}
            <MealEditor
              key={meal.id}
              mealId={meal.id}
              userId="1"
              mealName={meal.name}
              initialCategories={meal.categories}
              onUpdate={(categories, macroRange) => handleMealUpdate(meal.id, categories, macroRange)}
              onDelete={() => handleMealDelete(meal.id)}
            />
            
            {/* Add Meal Button - at the bottom of each meal */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
              <button
                onClick={() => handleMealAdd(index)}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full shadow-lg hover:from-purple-500 hover:to-purple-400 transition-all duration-300 font-medium border-b-2 border-purple-900 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>הוסף ארוחה</span>
              </button>
            </div>
          </div>
        ))}

        {/* Add meal button at the bottom if there are already meals */}
        {meals.length > 0 && (
          <button
            onClick={() => handleMealAdd()}
            className="w-full py-4 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl shadow-lg hover:from-purple-500 hover:to-purple-600 transition-all duration-300 text-lg border-b-4 border-purple-900"
          >
            <Plus className="h-6 w-6" />
            <span>הוסף ארוחה חדשה</span>
          </button>
        )}
      </div>

      {/* Template Selection Modal - simplified */}
      {showTemplateSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 shadow-xl border-2 border-purple-500">
            <div className="mb-4">
              <div className="p-2 bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Save className="h-6 w-6 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-200 mb-4">שמירת תבנית</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-purple-700 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-purple-300">
                  <p>האם תרצה ליצור תבנית חדשה או לעדכן תבנית קיימת?</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setShowTemplateSelectionModal(false);
                    setShowTemplateModal(true);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-700 to-purple-600 text-gray-200 rounded-xl hover:from-purple-600 hover:to-purple-500 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl border-b-2 border-purple-900 flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>צור תבנית חדשה</span>
                </button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">או</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                    <label className="block text-sm font-medium text-gray-300 mb-2">בחר תבנית קיימת לעדכון</label>
                    <select
                      className="w-full p-2 border-2 border-gray-700 bg-gray-800 text-gray-300 rounded-lg focus:border-purple-600 focus:ring focus:ring-purple-700 focus:ring-opacity-50"
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                      value={selectedTemplateId}
                    >
                      <option value="" disabled className="text-gray-500">בחר תבנית קיימת</option>
                      {mealTemplates.map(template => (
                        <option key={template.id} value={template.id} className="text-gray-300">
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={handleSaveToExisting}
                    disabled={!selectedTemplateId}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-b-2 border-green-900 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Save className="h-5 w-5" />
                    <span>שמור שינויים בתבנית</span>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setShowTemplateSelectionModal(false);
                    setSelectedTemplateId('');
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Template Modal - simplified */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 shadow-xl border-2 border-purple-500">
            <div className="mb-6 text-center">
              <div className="p-3 bg-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Save className="h-8 w-8 text-green-300" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-200 mb-2">שמור כתבנית</h3>
              <p className="text-gray-400">תן שם לתבנית כדי שתוכל לזהות אותה בקלות</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-300 mb-2">שם התבנית</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="למשל: תפריט דל פחמימות"
                  className="w-full p-3 text-lg bg-gray-800 border-2 border-gray-700 rounded-lg focus:border-purple-600 focus:ring focus:ring-purple-700 focus:ring-opacity-50 text-gray-200"
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-6 py-3 text-gray-400 hover:text-gray-300 transition-colors duration-200 font-medium"
                >
                  ביטול
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={!templateName.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg border-b-2 border-green-900"
                >
                  שמור תבנית
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};