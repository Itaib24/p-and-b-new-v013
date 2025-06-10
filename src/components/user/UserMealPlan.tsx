import React from 'react';
import { MacroDisplay } from '../meal/MacroDisplay';
import { getFoodById } from '../../data/foodDatabase';
import { MacroRange, MacroNutrients } from '../../types/food';
import { Utensils, Beef, Cookie, Coffee, ChevronDown, ChevronUp, Info, Wheat } from 'lucide-react';
import { useMealPlan } from '../../contexts/MealPlanContext';

interface UserMealPlanProps {
  userId: string;
}

export const UserMealPlan: React.FC<UserMealPlanProps> = ({ userId }) => {
  const { getMealPlanForUser } = useMealPlan();
  const userMealPlan = getMealPlanForUser(userId);
  const [expandedMealId, setExpandedMealId] = React.useState<string | null>(null);

  const calculateMealMacros = (categories: any[]): MacroRange => {
    const initialMacros: MacroNutrients = {
      protein: 0,
      carbs: 0,
      fats: 0,
      calories: 0
    };

    let minMacros = { ...initialMacros };
    let maxMacros = { ...initialMacros };

    if (!categories) return { min: minMacros, max: maxMacros };

    categories.forEach(category => {
      if (!category.options) return;
      
      category.options.forEach((option: any) => {
        const food = getFoodById(option.foodId);
        if (!food) return;

        const macros = {
          protein: (food.macrosPer100g.protein * option.amount) / 100,
          carbs: (food.macrosPer100g.carbs * option.amount) / 100,
          fats: (food.macrosPer100g.fats * option.amount) / 100,
          calories: (food.macrosPer100g.calories * option.amount) / 100
        };

        minMacros.protein += macros.protein;
        minMacros.carbs += macros.carbs;
        minMacros.fats += macros.fats;
        minMacros.calories += macros.calories;

        maxMacros.protein += macros.protein * 1.1;
        maxMacros.carbs += macros.carbs * 1.1;
        maxMacros.fats += macros.fats * 1.1;
        maxMacros.calories += macros.calories * 1.1;
      });
    });

    return { min: minMacros, max: maxMacros };
  };

  const calculateTotalMacros = (): MacroRange => {
    const initialMacros: MacroNutrients = {
      protein: 0,
      carbs: 0,
      fats: 0,
      calories: 0
    };

    let totalMin = { ...initialMacros };
    let totalMax = { ...initialMacros };

    if (!userMealPlan?.meals) return { min: totalMin, max: totalMax };

    userMealPlan.meals.forEach(meal => {
      const mealMacros = calculateMealMacros(meal.categories || []);
      
      totalMin.protein += mealMacros.min.protein;
      totalMin.carbs += mealMacros.min.carbs;
      totalMin.fats += mealMacros.min.fats;
      totalMin.calories += mealMacros.min.calories;

      totalMax.protein += mealMacros.max.protein;
      totalMax.carbs += mealMacros.max.carbs;
      totalMax.fats += mealMacros.max.fats;
      totalMax.calories += mealMacros.max.calories;
    });

    // Apply calorie adjustment if any
    if (userMealPlan?.calorieAdjustment) {
      totalMin.calories += userMealPlan.calorieAdjustment;
      totalMax.calories += userMealPlan.calorieAdjustment;
    }

    return { min: totalMin, max: totalMax };
  };

  const toggleMealExpand = (mealId: string) => {
    if (expandedMealId === mealId) {
      setExpandedMealId(null);
    } else {
      setExpandedMealId(mealId);
    }
  };

  if (!userMealPlan?.meals) {
    return (
      <div className="max-w-4xl mx-auto p-6\" dir="rtl">
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border-2 border-purple-800 text-center">
          <div className="text-gray-400">לא נמצאה תוכנית תזונה. המתן לעדכון מהמאמן.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 border-2 border-purple-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-purple-900 transform hover:rotate-12 transition-transform duration-300">
            <Utensils className="h-6 w-6 text-purple-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-200">תוכנית תזונה יומית</h2>
        </div>

        {!userMealPlan.hideMacros && (
          <div className="mb-6">
            {/* Show calorie adjustment if present */}
            {userMealPlan.calorieAdjustment && (
              <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/40 p-4 rounded-xl border border-blue-700/50 mb-4">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-blue-400" />
                  <div className="font-medium text-blue-300">
                    {userMealPlan.calorieAdjustment > 0 
                      ? `הקלוריות היומיות שלך הוגדלו ב-${userMealPlan.calorieAdjustment} כדי לתמוך בבניית שרירים.` 
                      : `הקלוריות היומיות שלך הופחתו ב-${Math.abs(userMealPlan.calorieAdjustment)} כדי לסייע בירידה בשומן.`
                    }
                  </div>
                </div>
              </div>
            )}
            
            {/* Compact Macro Display */}
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-white bg-purple-900 rounded-full px-2 py-1 font-medium">
                  חלבון: {Math.round(calculateTotalMacros().min.protein)}-{Math.round(calculateTotalMacros().max.protein)}g
                </span>
                
                <span className="text-sm text-white bg-amber-800 rounded-full px-2 py-1 font-medium">
                  פחמימות: {Math.round(calculateTotalMacros().min.carbs)}-{Math.round(calculateTotalMacros().max.carbs)}g
                </span>
                
                <span className="text-sm text-white bg-green-900 rounded-full px-2 py-1 font-medium">
                  שומן: {Math.round(calculateTotalMacros().min.fats)}-{Math.round(calculateTotalMacros().max.fats)}g
                </span>
                
                <span className="text-sm text-white bg-red-900 rounded-full px-2 py-1 font-medium">
                  קלוריות: {Math.round(calculateTotalMacros().min.calories)}-{Math.round(calculateTotalMacros().max.calories)}
                  {userMealPlan.calorieAdjustment && (
                    <span className={`ml-1 ${userMealPlan.calorieAdjustment > 0 ? 'text-green-300' : 'text-red-300'}`}>
                      ({userMealPlan.calorieAdjustment > 0 ? '+' : ''}{userMealPlan.calorieAdjustment})
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {userMealPlan.meals.map((meal, index) => {
            const proteinOptions = meal.categories?.find(cat => cat.name === 'Protein')?.options || [];
            const carbOptions = meal.categories?.find(cat => cat.name === 'Carb')?.options || [];
            const otherOptions = meal.categories?.find(cat => cat.name === 'Other')?.options || [];
            const totalFoodCount = proteinOptions.length + carbOptions.length + otherOptions.length;
            const isMealExpanded = expandedMealId === meal.id;

            return (
              <div key={index} className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-700">
                {/* Compact Header */}
                <div 
                  className="bg-gray-800 p-4 border-b border-gray-700 cursor-pointer"
                  onClick={() => toggleMealExpand(meal.id)}
                >
                  <div className="flex items-center justify-between">
                    {/* Meal Name */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-900 rounded-lg">
                        <Utensils className="h-5 w-5 text-purple-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-200">{meal.meal}</h3>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Info className="h-3 w-3" />
                          <span>{totalFoodCount} פריטי מזון</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expand/Collapse Button */}
                    <button
                      className="p-2 bg-purple-900 hover:bg-purple-800 rounded-lg transition-colors duration-200"
                    >
                      {isMealExpanded ? 
                        <ChevronUp className="h-4 w-4 text-purple-300" /> : 
                        <ChevronDown className="h-4 w-4 text-purple-300" />
                      }
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isMealExpanded && (
                  <div className="p-4 bg-gradient-to-t from-gray-800 to-gray-900">
                    {/* Food Lists */}
                    <div className="space-y-3 mb-4">
                      {/* Protein Foods */}
                      {proteinOptions.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-300 px-2 py-1 bg-purple-900 rounded-t-lg mb-1">חלבונים</div>
                          <div className="space-y-1">
                            {proteinOptions.map((option, idx) => {
                              const food = getFoodById(option.foodId);
                              if (!food) return null;
                              
                              // Calculate macros for amount
                              const macros = {
                                protein: Math.round((food.macrosPer100g.protein * option.amount) / 100),
                                carbs: Math.round((food.macrosPer100g.carbs * option.amount) / 100),
                                fats: Math.round((food.macrosPer100g.fats * option.amount) / 100),
                                calories: Math.round((food.macrosPer100g.calories * option.amount) / 100)
                              };
                              
                              return (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                                  {/* Food Name */}
                                  <div className="col-span-4 font-medium text-gray-200 truncate flex items-center gap-1">
                                    <div className="p-1 rounded-full bg-purple-900">
                                      <Beef className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="ml-1 truncate">{food.name}</span>
                                  </div>
                                  
                                  {/* Amount */}
                                  <div className="col-span-2 text-center bg-gray-900 rounded p-1 text-white text-xs flex items-center justify-center border border-gray-700">
                                    {option.amount}g
                                  </div>
                                  
                                  {/* Macros - styled like exercise metrics */}
                                  <div className="col-span-1 text-center bg-purple-900 rounded p-0.5 text-purple-200 text-xs">
                                    {macros.protein}g
                                  </div>
                                  
                                  <div className="col-span-1 text-center bg-amber-800 rounded p-0.5 text-amber-200 text-xs">
                                    {macros.carbs}g
                                  </div>
                                  
                                  <div className="col-span-1 text-center bg-green-900 rounded p-0.5 text-green-200 text-xs">
                                    {macros.fats}g
                                  </div>
                                  
                                  <div className="col-span-3 text-center bg-red-900 rounded p-0.5 text-red-200 text-xs">
                                    {macros.calories} קל'
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Carb Foods */}
                      {carbOptions.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-300 px-2 py-1 bg-amber-800 rounded-t-lg mb-1">פחמימות</div>
                          <div className="space-y-1">
                            {carbOptions.map((option, idx) => {
                              const food = getFoodById(option.foodId);
                              if (!food) return null;
                              
                              // Calculate macros for amount
                              const macros = {
                                protein: Math.round((food.macrosPer100g.protein * option.amount) / 100),
                                carbs: Math.round((food.macrosPer100g.carbs * option.amount) / 100),
                                fats: Math.round((food.macrosPer100g.fats * option.amount) / 100),
                                calories: Math.round((food.macrosPer100g.calories * option.amount) / 100)
                              };
                              
                              return (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                                  {/* Food Name */}
                                  <div className="col-span-4 font-medium text-gray-200 truncate flex items-center gap-1">
                                    <div className="p-1 rounded-full bg-amber-800">
                                      <Wheat className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="ml-1 truncate">{food.name}</span>
                                  </div>
                                  
                                  {/* Amount */}
                                  <div className="col-span-2 text-center bg-gray-900 rounded p-1 text-white text-xs flex items-center justify-center border border-gray-700">
                                    {option.amount}g
                                  </div>
                                  
                                  {/* Macros - styled like exercise metrics */}
                                  <div className="col-span-1 text-center bg-purple-900 rounded p-0.5 text-purple-200 text-xs">
                                    {macros.protein}g
                                  </div>
                                  
                                  <div className="col-span-1 text-center bg-amber-800 rounded p-0.5 text-amber-200 text-xs">
                                    {macros.carbs}g
                                  </div>
                                  
                                  <div className="col-span-1 text-center bg-green-900 rounded p-0.5 text-green-200 text-xs">
                                    {macros.fats}g
                                  </div>
                                  
                                  <div className="col-span-3 text-center bg-red-900 rounded p-0.5 text-red-200 text-xs">
                                    {macros.calories} קל'
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Other Foods */}
                      {otherOptions.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-300 px-2 py-1 bg-green-900 rounded-t-lg mb-1">אחר</div>
                          <div className="space-y-1">
                            {otherOptions.map((option, idx) => {
                              const food = getFoodById(option.foodId);
                              if (!food) return null;
                              
                              // Calculate macros for amount
                              const macros = {
                                protein: Math.round((food.macrosPer100g.protein * option.amount) / 100),
                                carbs: Math.round((food.macrosPer100g.carbs * option.amount) / 100),
                                fats: Math.round((food.macrosPer100g.fats * option.amount) / 100),
                                calories: Math.round((food.macrosPer100g.calories * option.amount) / 100)
                              };
                              
                              return (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                                  {/* Food Name */}
                                  <div className="col-span-4 font-medium text-gray-200 truncate flex items-center gap-1">
                                    <div className="p-1 rounded-full bg-green-900">
                                      <Coffee className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="ml-1 truncate">{food.name}</span>
                                  </div>
                                  
                                  {/* Amount */}
                                  <div className="col-span-2 text-center bg-gray-900 rounded p-1 text-white text-xs flex items-center justify-center border border-gray-700">
                                    {option.amount}g
                                  </div>
                                  
                                  {/* Macros - styled like exercise metrics */}
                                  <div className="col-span-1 text-center bg-purple-900 rounded p-0.5 text-purple-200 text-xs">
                                    {macros.protein}g
                                  </div>
                                  
                                  <div className="col-span-1 text-center bg-amber-800 rounded p-0.5 text-amber-200 text-xs">
                                    {macros.carbs}g
                                  </div>
                                  
                                  <div className="col-span-1 text-center bg-green-900 rounded p-0.5 text-green-200 text-xs">
                                    {macros.fats}g
                                  </div>
                                  
                                  <div className="col-span-3 text-center bg-red-900 rounded p-0.5 text-red-200 text-xs">
                                    {macros.calories} קל'
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Meal Macros if not hidden */}
                    {!userMealPlan.hideMacros && (
                      <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <span className="text-sm text-white bg-purple-900 rounded-full px-2 py-1 font-medium">
                            חלבון: {Math.round(calculateMealMacros(meal.categories || []).min.protein)}-{Math.round(calculateMealMacros(meal.categories || []).max.protein)}g
                          </span>
                          
                          <span className="text-sm text-white bg-amber-800 rounded-full px-2 py-1 font-medium">
                            פחמימות: {Math.round(calculateMealMacros(meal.categories || []).min.carbs)}-{Math.round(calculateMealMacros(meal.categories || []).max.carbs)}g
                          </span>
                          
                          <span className="text-sm text-white bg-green-900 rounded-full px-2 py-1 font-medium">
                            שומן: {Math.round(calculateMealMacros(meal.categories || []).min.fats)}-{Math.round(calculateMealMacros(meal.categories || []).max.fats)}g
                          </span>
                          
                          <span className="text-sm text-white bg-red-900 rounded-full px-2 py-1 font-medium">
                            קלוריות: {Math.round(calculateMealMacros(meal.categories || []).min.calories)}-{Math.round(calculateMealMacros(meal.categories || []).max.calories)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};