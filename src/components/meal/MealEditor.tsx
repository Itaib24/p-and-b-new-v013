import React, { useState, useEffect } from 'react';
import { FoodSelector } from './FoodSelector';
import { FoodCategorySelector } from './FoodCategorySelector';
import { MacroDisplay } from './MacroDisplay';
import { getFoodById } from '../../data/foodDatabase';
import { Utensils, Edit2, Check, X, ChevronDown, ChevronUp, Info, Wheat, Coffee, Clock } from 'lucide-react';
import { useMealPlan } from '../../contexts/MealPlanContext';
import { MacroRange, MealCategory } from '../../types/food';

interface MealEditorProps {
  mealId: string;
  userId: string;
  mealName: string;
  initialCategories: MealCategory[];
  onUpdate: (categories: MealCategory[], macroRange: MacroRange) => void;
  onDelete: () => void;
}

const MealEditor: React.FC<MealEditorProps> = ({
  mealId,
  userId,
  mealName,
  initialCategories,
  onUpdate,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(mealName);
  const [categories, setCategories] = useState<MealCategory[]>(initialCategories);
  const [activeFoodCategory, setActiveFoodCategory] = useState<'protein' | 'carbs' | 'other' | null>(null);
  const { updateMealPlan } = useMealPlan();

  const calculateMacroRange = (categories: MealCategory[]): MacroRange => {
    const initialMacros = {
      protein: 0,
      carbs: 0,
      fats: 0,
      calories: 0
    };

    let minMacros = { ...initialMacros };
    let maxMacros = { ...initialMacros };

    categories.forEach(category => {
      if (category.options.length === 0) return;

      const categoryMacros = category.options.map(option => {
        const food = getFoodById(option.foodId);
        if (!food) return null;

        const amount = option.amount;
        return {
          protein: (food.macrosPer100g.protein * amount) / 100,
          carbs: (food.macrosPer100g.carbs * amount) / 100,
          fats: (food.macrosPer100g.fats * amount) / 100,
          calories: (food.macrosPer100g.calories * amount) / 100
        };
      }).filter((m): m is NonNullable<typeof m> => m !== null);

      if (categoryMacros.length === 0) return;

      const categoryMin = {
        protein: Math.min(...categoryMacros.map(m => m.protein)),
        carbs: Math.min(...categoryMacros.map(m => m.carbs)),
        fats: Math.min(...categoryMacros.map(m => m.fats)),
        calories: Math.min(...categoryMacros.map(m => m.calories))
      };

      const categoryMax = {
        protein: Math.max(...categoryMacros.map(m => m.protein)),
        carbs: Math.max(...categoryMacros.map(m => m.carbs)),
        fats: Math.max(...categoryMacros.map(m => m.fats)),
        calories: Math.max(...categoryMacros.map(m => m.calories))
      };

      minMacros.protein += categoryMin.protein;
      minMacros.carbs += categoryMin.carbs;
      minMacros.fats += categoryMin.fats;
      minMacros.calories += categoryMin.calories;

      maxMacros.protein += categoryMax.protein;
      maxMacros.carbs += categoryMax.carbs;
      maxMacros.fats += categoryMax.fats;
      maxMacros.calories += categoryMax.calories;
    });

    const buffer = 1.05;
    maxMacros = {
      protein: maxMacros.protein * buffer,
      carbs: maxMacros.carbs * buffer,
      fats: maxMacros.fats * buffer,
      calories: maxMacros.calories * buffer
    };

    return { min: minMacros, max: maxMacros };
  };

  const handleFoodAdd = (category: string, food: any) => {
    const newCategories = [...categories];
    const categoryName = category === 'protein' ? 'Protein' : 
                        category === 'carbs' ? 'Carb' : 'Other';
    
    const categoryIndex = newCategories.findIndex(c => c.name === categoryName);
    
    if (categoryIndex === -1) {
      newCategories.push({
        name: categoryName,
        options: [{
          foodId: food.id,
          amount: food.defaultServing
        }]
      });
    } else {
      newCategories[categoryIndex].options.push({
        foodId: food.id,
        amount: food.defaultServing
      });
    }

    setCategories(newCategories);
    const macroRange = calculateMacroRange(newCategories);
    onUpdate(newCategories, macroRange);
    updateMealPlan(userId, mealId, newCategories);

    // Auto-close the food selector after adding
    setActiveFoodCategory(null);
  };

  const handleFoodUpdate = (categoryIndex: number, optionIndex: number, amount: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].options[optionIndex].amount = amount;
    setCategories(newCategories);
    const macroRange = calculateMacroRange(newCategories);
    onUpdate(newCategories, macroRange);
    updateMealPlan(userId, mealId, newCategories);
  };

  const handleFoodRemove = (categoryIndex: number, optionIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].options.splice(optionIndex, 1);
    if (newCategories[categoryIndex].options.length === 0) {
      newCategories.splice(categoryIndex, 1);
    }
    setCategories(newCategories);
    const macroRange = calculateMacroRange(newCategories);
    onUpdate(newCategories, macroRange);
    updateMealPlan(userId, mealId, newCategories);
  };

  const handleNameSave = () => {
    if (editedName.trim()) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const macroRange = calculateMacroRange(categories);
    onUpdate(categories, macroRange);
  }, []);

  const getAssignedFoods = (categoryType: 'protein' | 'carbs' | 'other'): string[] => {
    return categories
      .filter(category => 
        (categoryType === 'protein' && category.name === 'Protein') ||
        (categoryType === 'carbs' && category.name === 'Carb') ||
        (categoryType === 'other' && category.name === 'Other')
      )
      .flatMap(category => category.options.map(option => option.foodId));
  };

  // Get category counts
  const proteinOptions = categories.find(cat => cat.name === 'Protein')?.options || [];
  const carbOptions = categories.find(cat => cat.name === 'Carb')?.options || [];
  const otherOptions = categories.find(cat => cat.name === 'Other')?.options || [];

  const totalFoodCount = proteinOptions.length + carbOptions.length + otherOptions.length;

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl transition-all duration-300 overflow-hidden border-2 border-purple-600/50 hover:border-purple-500 transform hover:-translate-y-1 group">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 p-5 border-b border-gray-700/60 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {/* Meal Name */}
          {isEditing ? (
            <div className="flex items-center gap-3 bg-gray-800/80 p-3 rounded-xl border border-purple-700/50 shadow-inner">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-purple-500 rounded-lg text-lg font-semibold bg-gray-700/80 text-white shadow-inner focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all duration-300"
                placeholder="שם הארוחה"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNameSave}
                  className="p-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white transition-all duration-300 shadow-md font-medium border-b-2 border-green-800"
                  title="שמור"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedName(mealName);
                  }}
                  className="p-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white transition-all duration-300 shadow-md font-medium border-b-2 border-red-800"
                  title="בטל"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-700 to-purple-600 rounded-xl shadow-md transform group-hover:scale-105 transition-transform duration-300">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">{editedName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-sm">סה״כ {totalFoodCount} פריטים</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl bg-amber-600/70 hover:bg-amber-500/80 text-white transition-all duration-300 shadow-md"
                title="ערוך שם"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {/* Expand/Collapse Button */}
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

      {/* Food Selection Area */}
      {isExpanded && (
        <div className="p-6 bg-gradient-to-b from-gray-800/90 to-gray-900/90 space-y-6">
          {/* Food Category Selectors */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Protein Category */}
            <div className="space-y-3">
              <button
                onClick={() => setActiveFoodCategory(activeFoodCategory === 'protein' ? null : 'protein')}
                className={`w-full p-4 rounded-xl ${
                  activeFoodCategory === 'protein'
                    ? 'bg-gradient-to-r from-purple-700 to-purple-600 border-2 border-purple-500/50'
                    : 'bg-gradient-to-r from-gray-700/80 to-gray-800/80 border-2 border-gray-600/30 hover:border-purple-500/30'
                } transition-all duration-300 shadow-lg text-center group`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-3 ${
                    activeFoodCategory === 'protein' 
                      ? 'bg-purple-800' 
                      : 'bg-purple-900/60'
                    } rounded-xl shadow-md transform group-hover:scale-110 transition-all duration-300`}>
                    <Utensils className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white text-base">חלבונים {proteinOptions.length > 0 && 
                    <span className="inline-flex items-center justify-center bg-purple-700/70 text-white text-xs rounded-full h-5 w-5 border border-purple-600/50">
                      {proteinOptions.length}
                    </span>
                  }</h4>
                </div>
              </button>
              
              {activeFoodCategory === 'protein' && (
                <div className="animate-fade-in-up">
                  <FoodCategorySelector
                    category="protein"
                    onFoodSelect={(food) => handleFoodAdd('protein', food)}
                    assignedFoods={getAssignedFoods('protein')}
                  />
                </div>
              )}
            </div>
            
            {/* Carbs Category */}
            <div className="space-y-3">
              <button
                onClick={() => setActiveFoodCategory(activeFoodCategory === 'carbs' ? null : 'carbs')}
                className={`w-full p-4 rounded-xl ${
                  activeFoodCategory === 'carbs'
                    ? 'bg-gradient-to-r from-amber-700 to-amber-600 border-2 border-amber-500/50'
                    : 'bg-gradient-to-r from-gray-700/80 to-gray-800/80 border-2 border-gray-600/30 hover:border-amber-500/30'
                } transition-all duration-300 shadow-lg text-center group`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-3 ${
                    activeFoodCategory === 'carbs' 
                      ? 'bg-amber-800' 
                      : 'bg-amber-900/60'
                    } rounded-xl shadow-md transform group-hover:scale-110 transition-all duration-300`}>
                    <Wheat className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white text-base">פחמימות {carbOptions.length > 0 && 
                    <span className="inline-flex items-center justify-center bg-amber-700/70 text-white text-xs rounded-full h-5 w-5 border border-amber-600/50">
                      {carbOptions.length}
                    </span>
                  }</h4>
                </div>
              </button>
              
              {activeFoodCategory === 'carbs' && (
                <div className="animate-fade-in-up">
                  <FoodCategorySelector
                    category="carbs"
                    onFoodSelect={(food) => handleFoodAdd('carbs', food)}
                    assignedFoods={getAssignedFoods('carbs')}
                  />
                </div>
              )}
            </div>
            
            {/* Other Category */}
            <div className="space-y-3">
              <button
                onClick={() => setActiveFoodCategory(activeFoodCategory === 'other' ? null : 'other')}
                className={`w-full p-4 rounded-xl ${
                  activeFoodCategory === 'other'
                    ? 'bg-gradient-to-r from-green-700 to-green-600 border-2 border-green-500/50'
                    : 'bg-gradient-to-r from-gray-700/80 to-gray-800/80 border-2 border-gray-600/30 hover:border-green-500/30'
                } transition-all duration-300 shadow-lg text-center group`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-3 ${
                    activeFoodCategory === 'other' 
                      ? 'bg-green-800' 
                      : 'bg-green-900/60'
                    } rounded-xl shadow-md transform group-hover:scale-110 transition-all duration-300`}>
                    <Coffee className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white text-base">אחר {otherOptions.length > 0 && 
                    <span className="inline-flex items-center justify-center bg-green-700/70 text-white text-xs rounded-full h-5 w-5 border border-green-600/50">
                      {otherOptions.length}
                    </span>
                  }</h4>
                </div>
              </button>
              
              {activeFoodCategory === 'other' && (
                <div className="animate-fade-in-up">
                  <FoodCategorySelector
                    category="other"
                    onFoodSelect={(food) => handleFoodAdd('other', food)}
                    assignedFoods={getAssignedFoods('other')}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Food Lists with Matching Styling to Exercise Lists */}
          <div className="space-y-4">
            {/* Protein Foods */}
            {proteinOptions.length > 0 && (
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl overflow-hidden border border-gray-600/50 shadow-lg">
                <div className="bg-gradient-to-r from-purple-800/80 to-purple-700/80 py-2 px-3 border-b border-purple-700/50 flex items-center gap-2">
                  <div className="p-1.5 bg-purple-900 rounded-lg">
                    <Utensils className="h-4 w-4 text-purple-300" />
                  </div>
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    חלבונים
                    <span className="inline-flex items-center justify-center bg-purple-700/70 text-white text-xs rounded-full h-5 w-5 border border-purple-600/50">
                      {proteinOptions.length}
                    </span>
                  </div>
                </div>
                
                {/* Food List Header - Match Exercise List Style */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-800/80 text-gray-300 text-sm font-medium border-b border-gray-700/50">
                  <div className="col-span-5 flex items-center">
                    <span>מזון</span>
                  </div>
                  <div className="col-span-2 text-center">כמות</div>
                  <div className="col-span-1 text-center">חלבון</div>
                  <div className="col-span-1 text-center">פחמ'</div>
                  <div className="col-span-1 text-center">שומן</div>
                  <div className="col-span-1 text-center">קל'</div>
                  <div className="col-span-1 text-center"></div>
                </div>
                
                <div className="divide-y divide-gray-700/50">
                  {categories
                    .filter(category => category.name === 'Protein')
                    .map((category, categoryIndex) => (
                      category.options.map((option, optionIndex) => {
                        const food = getFoodById(option.foodId);
                        if (!food) return null;
                        
                        return (
                          <FoodSelector
                            key={`protein-${optionIndex}`}
                            food={food}
                            amount={option.amount}
                            onAmountChange={(amount) => handleFoodUpdate(categoryIndex, optionIndex, amount)}
                            onRemove={() => handleFoodRemove(categoryIndex, optionIndex)}
                          />
                        );
                      })
                    ))}
                </div>
              </div>
            )}
            
            {/* Carb Foods */}
            {carbOptions.length > 0 && (
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl overflow-hidden border border-gray-600/50 shadow-lg">
                <div className="bg-gradient-to-r from-amber-800/80 to-amber-700/80 py-2 px-3 border-b border-amber-700/50 flex items-center gap-2">
                  <div className="p-1.5 bg-amber-900 rounded-lg">
                    <Wheat className="h-4 w-4 text-amber-300" />
                  </div>
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    פחמימות
                    <span className="inline-flex items-center justify-center bg-amber-700/70 text-white text-xs rounded-full h-5 w-5 border border-amber-600/50">
                      {carbOptions.length}
                    </span>
                  </div>
                </div>
                
                {/* Food List Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-800/80 text-gray-300 text-sm font-medium border-b border-gray-700/50">
                  <div className="col-span-5 flex items-center">
                    <span>מזון</span>
                  </div>
                  <div className="col-span-2 text-center">כמות</div>
                  <div className="col-span-1 text-center">חלבון</div>
                  <div className="col-span-1 text-center">פחמ'</div>
                  <div className="col-span-1 text-center">שומן</div>
                  <div className="col-span-1 text-center">קל'</div>
                  <div className="col-span-1 text-center"></div>
                </div>
                
                <div className="divide-y divide-gray-700/50">
                  {categories
                    .filter(category => category.name === 'Carb')
                    .map((category, categoryIndex) => (
                      category.options.map((option, optionIndex) => {
                        const food = getFoodById(option.foodId);
                        if (!food) return null;
                        
                        return (
                          <FoodSelector
                            key={`carb-${optionIndex}`}
                            food={food}
                            amount={option.amount}
                            onAmountChange={(amount) => handleFoodUpdate(categoryIndex, optionIndex, amount)}
                            onRemove={() => handleFoodRemove(categoryIndex, optionIndex)}
                          />
                        );
                      })
                    ))}
                </div>
              </div>
            )}
            
            {/* Other Foods */}
            {otherOptions.length > 0 && (
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl overflow-hidden border border-gray-600/50 shadow-lg">
                <div className="bg-gradient-to-r from-green-800/80 to-green-700/80 py-2 px-3 border-b border-green-700/50 flex items-center gap-2">
                  <div className="p-1.5 bg-green-900 rounded-lg">
                    <Coffee className="h-4 w-4 text-green-300" />
                  </div>
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    אחר
                    <span className="inline-flex items-center justify-center bg-green-700/70 text-white text-xs rounded-full h-5 w-5 border border-green-600/50">
                      {otherOptions.length}
                    </span>
                  </div>
                </div>
                
                {/* Food List Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-800/80 text-gray-300 text-sm font-medium border-b border-gray-700/50">
                  <div className="col-span-5 flex items-center">
                    <span>מזון</span>
                  </div>
                  <div className="col-span-2 text-center">כמות</div>
                  <div className="col-span-1 text-center">חלבון</div>
                  <div className="col-span-1 text-center">פחמ'</div>
                  <div className="col-span-1 text-center">שומן</div>
                  <div className="col-span-1 text-center">קל'</div>
                  <div className="col-span-1 text-center"></div>
                </div>
                
                <div className="divide-y divide-gray-700/50">
                  {categories
                    .filter(category => category.name === 'Other')
                    .map((category, categoryIndex) => (
                      category.options.map((option, optionIndex) => {
                        const food = getFoodById(option.foodId);
                        if (!food) return null;
                        
                        return (
                          <FoodSelector
                            key={`other-${optionIndex}`}
                            food={food}
                            amount={option.amount}
                            onAmountChange={(amount) => handleFoodUpdate(categoryIndex, optionIndex, amount)}
                            onRemove={() => handleFoodRemove(categoryIndex, optionIndex)}
                          />
                        );
                      })
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Premium Macro Summary */}
          {totalFoodCount > 0 && (
            <div className="mt-2 bg-gradient-to-r from-gray-800/90 via-gray-900/90 to-gray-800/90 rounded-xl p-5 border border-purple-600/30 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg shadow-md">
                  <Info className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-medium text-white">סיכום מאקרו לארוחה זו</h4>
              </div>
              <MacroDisplay macroRange={calculateMacroRange(categories)} showTitle={false} />
            </div>
          )}
          
          {/* Empty State */}
          {totalFoodCount === 0 && (
            <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-xl p-5 border border-purple-700/30 text-center">
              <p className="text-gray-400 mb-4">
                אין פריטי מזון בארוחה זו עדיין. לחץ על אחת מקטגוריות המזון למעלה כדי להוסיף.
              </p>
              <div className="flex justify-center gap-3">
                {['protein', 'carbs', 'other'].map((category) => (
                  <button 
                    key={category} 
                    onClick={() => setActiveFoodCategory(category as 'protein' | 'carbs' | 'other')}
                    className={`px-4 py-2 rounded-lg bg-gradient-to-r ${
                      category === 'protein' ? 'from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 border-b-2 border-purple-900' : 
                      category === 'carbs' ? 'from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 border-b-2 border-amber-900' : 
                      'from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 border-b-2 border-green-900'
                    } text-white transition-all duration-300 shadow-md transform hover:scale-105`}
                  >
                    {category === 'protein' ? 'הוסף חלבון' : 
                     category === 'carbs' ? 'הוסף פחמימה' : 
                     'הוסף אחר'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealEditor;