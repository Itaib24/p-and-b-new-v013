import React, { useState } from 'react';
import { FoodItem, MealCategory } from '../../types/food';
import { getFoodsByCategory, addCustomFood } from '../../data/foodDatabase';
import { Plus, Search, Check, X, Sparkles, Info, Apple, Utensils, Wheat } from 'lucide-react';
import { CustomFoodInput } from './CustomFoodInput';

interface FoodCategorySelectorProps {
  category: string;
  onFoodSelect: (food: FoodItem) => void;
  assignedFoods?: string[];
}

export const FoodCategorySelector: React.FC<FoodCategorySelectorProps> = ({
  category,
  onFoodSelect,
  assignedFoods = []
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [hoveredFoodId, setHoveredFoodId] = useState<string | null>(null);
  const foods = getFoodsByCategory(category);

  const filteredFoods = searchTerm
    ? foods.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !assignedFoods.includes(food.id)
      )
    : foods.filter(food => !assignedFoods.includes(food.id));

  const handleCustomFoodSave = (customFood: {
    name: string;
    category: 'protein' | 'carbs' | 'other';
    macros: {
      protein: number;
      carbs: number;
      fats: number;
      calories: number;
    };
    amount: number;
  }) => {
    const newFood: FoodItem = {
      id: `custom-${Date.now()}`,
      name: customFood.name,
      category: customFood.category,
      macrosPer100g: {
        protein: (customFood.macros.protein * 100) / customFood.amount,
        carbs: (customFood.macros.carbs * 100) / customFood.amount,
        fats: (customFood.macros.fats * 100) / customFood.amount,
        calories: (customFood.macros.calories * 100) / customFood.amount
      },
      defaultServing: customFood.amount,
      minServing: Math.max(10, customFood.amount - 50),
      maxServing: customFood.amount + 50
    };

    // Add to database and get the saved food with proper ID
    const savedFood = addCustomFood('1', newFood); // Using '1' as default user ID
    onFoodSelect(savedFood);
    setShowCustomInput(false);
  };

  const getCategoryTheme = (category: string) => {
    switch(category) {
      case 'protein': 
        return {
          button: 'from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 border-purple-900',
          highlight: 'bg-purple-900/40 text-purple-300 border-purple-800/30',
          icon: 'from-purple-700 to-purple-600 border-purple-800'
        };
      case 'carbs': 
        return {
          button: 'from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 border-amber-900',
          highlight: 'bg-amber-900/40 text-amber-300 border-amber-800/30',
          icon: 'from-amber-700 to-amber-600 border-amber-800'
        };
      case 'other': 
        return {
          button: 'from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 border-green-900',
          highlight: 'bg-green-900/40 text-green-300 border-green-800/30',
          icon: 'from-green-700 to-green-600 border-green-800'
        };
      default:
        return {
          button: 'from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 border-blue-900',
          highlight: 'bg-blue-900/40 text-blue-300 border-blue-800/30',
          icon: 'from-blue-700 to-blue-600 border-blue-800'
        };
    }
  };

  const theme = getCategoryTheme(category);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`חיפוש ${category === 'protein' ? 'חלבונים' : category === 'carbs' ? 'פחמימות' : 'מזונות אחרים'}`}
          className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-600 rounded-xl appearance-none bg-gray-800/70 text-white cursor-text focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 shadow-inner placeholder-gray-400"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Custom Food Button */}
      <button
        onClick={() => setShowCustomInput(true)}
        className={`w-full py-3 rounded-xl flex items-center justify-center gap-3 text-white font-medium shadow-md transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r ${theme.button} border-b-2`}
      >
        <Sparkles className="h-5 w-5" />
        <span>הוספת {category === 'protein' ? 'חלבון' : category === 'carbs' ? 'פחמימה' : 'מזון'} מותאם אישית</span>
      </button>

      {/* Food List */}
      <div className="bg-gradient-to-r from-gray-800/70 to-gray-700/70 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
        <div className="p-3 bg-gray-700/70 border-b border-gray-600/50 flex items-center justify-between">
          <span className="text-sm font-medium text-white">בחירה ממזונות קיימים</span>
          <span className="text-xs text-gray-300 bg-gray-600/70 px-2 py-1 rounded-lg">
            {filteredFoods.length} פריטים
          </span>
        </div>
        
        {filteredFoods.length === 0 ? (
          <div className="p-5 text-center text-gray-400">
            {searchTerm ? 'לא נמצאו תוצאות התואמות לחיפוש' : 'אין פריטים זמינים'}
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto divide-y divide-gray-600/30">
            {filteredFoods.map(food => (
              <button
                key={food.id}
                className={`w-full p-3 flex items-center justify-between group/food text-left hover:bg-gray-700/60 transition-all duration-200 relative ${
                  hoveredFoodId === food.id ? 'bg-gray-700/50 border-r-4 border-r-purple-600' : ''
                }`}
                onClick={() => onFoodSelect(food)}
                onMouseEnter={() => setHoveredFoodId(food.id)}
                onMouseLeave={() => setHoveredFoodId(null)}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.icon}`}>
                    {category === 'protein' ? 
                      <Utensils className="h-4 w-4 text-white" /> : 
                      category === 'carbs' ? 
                      <Wheat className="h-4 w-4 text-white" /> : 
                      <Apple className="h-4 w-4 text-white" />
                    }
                  </div>
                  <div>
                    <span className="font-medium text-white">{food.name}</span>
                    {hoveredFoodId === food.id && (
                      <div className="flex mt-1 gap-2 text-xs">
                        <span className={`px-1.5 py-0.5 rounded ${theme.highlight}`}>
                          {Math.round(food.macrosPer100g.protein)}g חלבון
                        </span>
                        <span className="text-gray-400">{food.defaultServing}g מנה</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {hoveredFoodId === food.id && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-green-500 rounded-full p-1 border-2 border-white shadow-md animate-fade-in-up">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                
                {!hoveredFoodId || hoveredFoodId !== food.id ? (
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center opacity-0 group-hover/food:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${theme.icon}`}>
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className={`px-2 py-1 rounded-lg ${theme.highlight} text-xs font-medium`}>
                    הוסף
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Food Input Modal */}
      {showCustomInput && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <div className="max-w-xl w-full mx-4">
            <CustomFoodInput
              category={category as 'protein' | 'carbs' | 'other'}
              onSave={handleCustomFoodSave}
              onClose={() => setShowCustomInput(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};