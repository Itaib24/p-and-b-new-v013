import React, { useState } from 'react';
import { FoodItem } from '../../types/food';
import { Trash2, Plus, Minus, Utensils, Wheat, Apple } from 'lucide-react';

interface FoodSelectorProps {
  food: FoodItem;
  amount: number;
  onAmountChange: (amount: number) => void;
  onRemove: () => void;
}

export const FoodSelector: React.FC<FoodSelectorProps> = ({
  food,
  amount,
  onAmountChange,
  onRemove
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(amount.toString());

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditAmount(e.target.value);
  };

  const saveAmount = () => {
    const value = parseInt(editAmount);
    if (!isNaN(value) && value > 0) {
      if (food.minServing && value < food.minServing) return;
      if (food.maxServing && value > food.maxServing) return;
      onAmountChange(value);
    }
    setIsEditing(false);
  };

  // Calculate macros for current amount
  const macros = {
    protein: Math.round((food.macrosPer100g.protein * amount) / 100),
    carbs: Math.round((food.macrosPer100g.carbs * amount) / 100),
    fats: Math.round((food.macrosPer100g.fats * amount) / 100),
    calories: Math.round((food.macrosPer100g.calories * amount) / 100)
  };

  // Get category icon based on food category
  const getCategoryIcon = () => {
    switch (food.category) {
      case 'protein':
        return <Utensils className="h-5 w-5 text-white" />;
      case 'carbs':
        return <Wheat className="h-5 w-5 text-white" />;
      case 'other':
        return <Apple className="h-5 w-5 text-white" />;
      default:
        return null;
    }
  };

  // Get category colors for styling
  const getCategoryColor = () => {
    switch (food.category) {
      case 'protein':
        return 'from-purple-700 to-purple-600 border-purple-800';
      case 'carbs':
        return 'from-amber-700 to-amber-600 border-amber-800';
      case 'other':
        return 'from-green-700 to-green-600 border-green-800';
      default:
        return 'from-gray-700 to-gray-600 border-gray-800';
    }
  };

  return (
    <div className="p-2 hover:bg-gray-700/40 transition-colors duration-200 group">
      <div className="grid grid-cols-12 gap-2 items-center">
        {/* Food Name - matching exercise name style */}
        <div className="col-span-5 font-medium text-white flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r text-sm text-white font-semibold">
            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${getCategoryColor()}`}>
              {getCategoryIcon()}
            </div>
          </div>
          <span className="truncate">{food.name}</span>
        </div>
        
        {/* Quantity - styled like sets, clicking shows edit form */}
        <div className="col-span-2 text-center">
          {isEditing ? (
            <div className="flex">
              <input
                type="number"
                value={editAmount}
                onChange={handleAmountChange}
                onBlur={saveAmount}
                onKeyPress={(e) => e.key === 'Enter' && saveAmount()}
                className="w-full text-center py-0.5 border border-purple-500 bg-gray-800 rounded text-white text-sm focus:ring-1 focus:ring-purple-500"
                autoFocus
              />
            </div>
          ) : (
            <div 
              className="bg-purple-900/70 rounded-lg py-1.5 px-3 text-white text-sm font-medium border border-purple-700/50 flex items-center justify-center cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <span>{amount}g</span>
            </div>
          )}
        </div>
        
        {/* Protein - styled like reps */}
        <div className="col-span-1 text-center">
          <div className="bg-purple-900/70 rounded-lg p-0.5 text-purple-200 text-xs border border-purple-700/50">
            {macros.protein}
          </div>
        </div>
        
        {/* Carbs - styled like reps */}
        <div className="col-span-1 text-center">
          <div className="bg-amber-900/70 rounded-lg p-0.5 text-amber-200 text-xs border border-amber-700/50">
            {macros.carbs}
          </div>
        </div>
        
        {/* Fats - styled like reps */}
        <div className="col-span-1 text-center">
          <div className="bg-green-900/70 rounded-lg p-0.5 text-green-200 text-xs border border-green-700/50">
            {macros.fats}
          </div>
        </div>
        
        {/* Calories - styled like rest */}
        <div className="col-span-1 text-center">
          <div className="bg-red-900/70 rounded-lg p-0.5 text-red-200 text-xs border border-red-700/50 flex items-center justify-center">
            {macros.calories}
          </div>
        </div>
        
        {/* Actions - match exercise actions */}
        <div className="col-span-1 flex justify-end">
          <button
            onClick={onRemove}
            className="p-1.5 bg-red-600/80 hover:bg-red-500/90 text-white rounded-lg shadow-sm transition-all duration-200"
            title="מחק"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};