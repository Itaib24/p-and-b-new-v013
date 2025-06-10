import { FoodItem } from '../types/food';

// Custom foods storage with persistence
const customFoods: { [userId: string]: FoodItem[] } = {};

export const foodDatabase: FoodItem[] = [
  // Protein Sources
  {
    id: 'chicken_breast',
    name: 'חזה עוף',
    category: 'protein',
    macrosPer100g: {
      protein: 31,
      carbs: 0,
      fats: 3.6,
      calories: 165
    },
    defaultServing: 170,
    minServing: 150,
    maxServing: 200
  },
  {
    id: 'salmon',
    name: 'סלמון',
    category: 'protein',
    macrosPer100g: {
      protein: 25,
      carbs: 0,
      fats: 13,
      calories: 208
    },
    defaultServing: 150,
    minServing: 130,
    maxServing: 180
  },
  {
    id: 'tilapia',
    name: 'אמנון',
    category: 'protein',
    macrosPer100g: {
      protein: 26,
      carbs: 0,
      fats: 2.7,
      calories: 128
    },
    defaultServing: 170,
    minServing: 150,
    maxServing: 200
  },
  {
    id: 'eggs',
    name: 'ביצים שלמות',
    category: 'protein',
    macrosPer100g: {
      protein: 13,
      carbs: 0.7,
      fats: 11,
      calories: 155
    },
    defaultServing: 150,
    minServing: 100,
    maxServing: 200
  },
  {
    id: 'tuna',
    name: 'טונה במים',
    category: 'protein',
    macrosPer100g: {
      protein: 26,
      carbs: 0,
      fats: 1,
      calories: 116
    },
    defaultServing: 130,
    minServing: 100,
    maxServing: 160
  },
  {
    id: 'protein_powder',
    name: 'אבקת חלבון',
    category: 'protein',
    macrosPer100g: {
      protein: 80,
      carbs: 10,
      fats: 2,
      calories: 380
    },
    defaultServing: 50,
    minServing: 30,
    maxServing: 60
  },

  // Carb Sources
  {
    id: 'sweet_potato',
    name: 'בטטה',
    category: 'carbs',
    macrosPer100g: {
      protein: 1.6,
      carbs: 20,
      fats: 0.1,
      calories: 86
    },
    defaultServing: 300,
    minServing: 200,
    maxServing: 400
  },
  {
    id: 'rice',
    name: 'אורז',
    category: 'carbs',
    macrosPer100g: {
      protein: 2.7,
      carbs: 28,
      fats: 0.3,
      calories: 130
    },
    defaultServing: 200,
    minServing: 150,
    maxServing: 300
  },
  {
    id: 'potato',
    name: 'תפוח אדמה',
    category: 'carbs',
    macrosPer100g: {
      protein: 2,
      carbs: 17,
      fats: 0.1,
      calories: 77
    },
    defaultServing: 380,
    minServing: 300,
    maxServing: 450
  },
  {
    id: 'oats',
    name: 'שיבולת שועל',
    category: 'carbs',
    macrosPer100g: {
      protein: 13.5,
      carbs: 68,
      fats: 6.5,
      calories: 389
    },
    defaultServing: 80,
    minServing: 60,
    maxServing: 100
  },
  {
    id: 'bread',
    name: 'לחם שיפון',
    category: 'carbs',
    macrosPer100g: {
      protein: 8.5,
      carbs: 43,
      fats: 1.2,
      calories: 216
    },
    defaultServing: 120,
    minServing: 90,
    maxServing: 150
  },
  {
    id: 'banana',
    name: 'בננה',
    category: 'carbs',
    macrosPer100g: {
      protein: 1.1,
      carbs: 23,
      fats: 0.3,
      calories: 89
    },
    defaultServing: 120,
    minServing: 100,
    maxServing: 140
  },

  // Fats
  {
    id: 'olive_oil',
    name: 'שמן זית',
    category: 'other',
    macrosPer100g: {
      protein: 0,
      carbs: 0,
      fats: 100,
      calories: 884
    },
    defaultServing: 10,
    minServing: 5,
    maxServing: 15
  },
  {
    id: 'peanut_butter',
    name: 'חמאת בוטנים טבעית',
    category: 'other',
    macrosPer100g: {
      protein: 25,
      carbs: 20,
      fats: 50,
      calories: 589
    },
    defaultServing: 15,
    minServing: 10,
    maxServing: 30
  }
];

export const getFoodById = (id: string): FoodItem | undefined => {
  // First check custom foods
  for (const userFoods of Object.values(customFoods)) {
    const customFood = userFoods.find(food => food.id === id);
    if (customFood) return customFood;
  }
  // Then check database
  return foodDatabase.find(food => food.id === id);
};

export const getFoodsByCategory = (category: string): FoodItem[] => {
  // Get standard foods
  const standardFoods = foodDatabase.filter(food => food.category === category);
  
  // Get custom foods for all users
  const allCustomFoods = Object.values(customFoods).flat();
  const customFoodsForCategory = allCustomFoods.filter(food => food.category === category);
  
  // Combine and sort by name
  return [...standardFoods, ...customFoodsForCategory].sort((a, b) => a.name.localeCompare(b.name));
};

export const addCustomFood = (userId: string, food: FoodItem): FoodItem => {
  if (!customFoods[userId]) {
    customFoods[userId] = [];
  }
  
  // Create a new food item with a unique ID
  const newFood = {
    ...food,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  
  customFoods[userId].push(newFood);
  return newFood;
};

export const getCustomFoods = (userId: string): FoodItem[] => {
  return customFoods[userId] || [];
};