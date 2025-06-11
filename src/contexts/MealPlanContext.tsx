import React, { createContext, useContext, useState } from 'react';
import { MealCategory } from '../types/food';

interface MealTemplate {
  id: string;
  name: string;
  meals: {
    id: string;
    meal: string;
    categories: MealCategory[];
  }[];
}

export interface MealPlan {
  id: string;
  userId: string;
  hideMacros: boolean;
  calorieAdjustment?: number; // Track calorie adjustments
  meals: {
    id: string;
    meal: string;
    categories: MealCategory[];
  }[];
}

interface MealPlanContextType {
  mealPlans: MealPlan[];
  mealTemplates: MealTemplate[];
  updateMealPlan: (userId: string, mealId: string, categories: MealCategory[]) => void;
  getMealPlanForUser: (userId: string) => MealPlan | null;
  initializeMealPlan: (userId: string) => void;
  toggleHideMacros: (userId: string) => void;
  saveAsTemplate: (name: string, meals: MealPlan['meals']) => void;
  loadTemplate: (templateId: string, userId: string) => void;
  applyCalorieAdjustment: (userId: string, calorieChange: number) => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [mealTemplates, setMealTemplates] = useState<MealTemplate[]>([]);

  const initializeMealPlan = (userId: string) => {
    setMealPlans(prevPlans => {
      if (prevPlans.some(plan => plan.userId === userId)) {
        return prevPlans;
      }

      const newPlan: MealPlan = {
        id: `plan-${userId}`,
        userId,
        hideMacros: false,
        meals: []
      };

      return [...prevPlans, newPlan];
    });
  };

  const toggleHideMacros = (userId: string) => {
    setMealPlans(prevPlans => {
      return prevPlans.map(plan => {
        if (plan.userId === userId) {
          return {
            ...plan,
            hideMacros: !plan.hideMacros
          };
        }
        return plan;
      });
    });
  };

  const saveAsTemplate = (name: string, meals: MealPlan['meals']) => {
    const newTemplate: MealTemplate = {
      id: `template-${Date.now()}`,
      name,
      meals: JSON.parse(JSON.stringify(meals)) // Deep copy
    };
    setMealTemplates(prev => [...prev, newTemplate]);
  };

  const loadTemplate = (templateId: string, userId: string) => {
    const template = mealTemplates.find(t => t.id === templateId);
    if (!template) return;

    setMealPlans(prevPlans => {
      return prevPlans.map(plan => {
        if (plan.userId === userId) {
          return {
            ...plan,
            meals: JSON.parse(JSON.stringify(template.meals)) // Deep copy
          };
        }
        return plan;
      });
    });
  };

  const updateMealPlan = (userId: string, mealId: string, categories: MealCategory[]) => {
    setMealPlans(prevPlans => {
      const existingPlanIndex = prevPlans.findIndex(plan => plan.userId === userId);
      
      if (existingPlanIndex >= 0) {
        const updatedPlan = { ...prevPlans[existingPlanIndex] };
        const mealIndex = updatedPlan.meals.findIndex(meal => meal.id === mealId);
        
        if (mealIndex >= 0) {
          updatedPlan.meals[mealIndex] = {
            ...updatedPlan.meals[mealIndex],
            categories
          };
        } else {
          updatedPlan.meals.push({
            id: mealId,
            meal: `ארוחה ${updatedPlan.meals.length + 1}`,
            categories
          });
        }
        
        const newPlans = [...prevPlans];
        newPlans[existingPlanIndex] = updatedPlan;
        return newPlans;
      }
      
      const newPlan: MealPlan = {
        id: `plan-${userId}`,
        userId,
        hideMacros: false,
        meals: [{
          id: mealId,
          meal: 'ארוחה 1',
          categories
        }]
      };
      
      return [...prevPlans, newPlan];
    });
  };

  // New function to apply calorie adjustment
  const applyCalorieAdjustment = (userId: string, calorieChange: number) => {
    setMealPlans(prevPlans => {
      return prevPlans.map(plan => {
        if (plan.userId === userId) {
          // Get current adjustment or default to 0
          const currentAdjustment = plan.calorieAdjustment || 0;
          return {
            ...plan,
            // Apply the new adjustment on top of any existing adjustment
            calorieAdjustment: currentAdjustment + calorieChange
          };
        }
        return plan;
      });
    });
  };

  const getMealPlanForUser = (userId: string): MealPlan | null => {
    return mealPlans.find(plan => plan.userId === userId) || null;
  };

  return (
    <MealPlanContext.Provider value={{ 
      mealPlans, 
      mealTemplates,
      updateMealPlan, 
      getMealPlanForUser, 
      initializeMealPlan,
      toggleHideMacros,
      saveAsTemplate,
      loadTemplate,
      applyCalorieAdjustment
    }}>
      {children}
    </MealPlanContext.Provider>
  );
};

export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  if (context === undefined) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
};