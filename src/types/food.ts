export interface MacroNutrients {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export interface MacroRange {
  min: MacroNutrients;
  max: MacroNutrients;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'protein' | 'carbs' | 'fats' | 'other';
  macrosPer100g: MacroNutrients;
  defaultServing: number; // in grams
  minServing?: number;
  maxServing?: number;
}

export interface MealOption {
  foodId: string;
  amount: number; // in grams
}

export interface MealCategory {
  name: 'Protein' | 'Carb' | 'Other';
  options: MealOption[];
}

export interface Meal {
  id: string;
  name: string;
  categories: MealCategory[];
  macroRange: MacroRange;
}

export interface DailyMealPlan {
  meals: Meal[];
  totalMacroRange: MacroRange;
}