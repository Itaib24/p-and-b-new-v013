import React, { useState } from 'react';
import { Coffee, Save, X, Check, Info, Beef, Cookie, Apple } from 'lucide-react';

interface CustomFoodInputProps {
  category: 'protein' | 'carbs' | 'other';
  onSave: (food: {
    name: string;
    category: 'protein' | 'carbs' | 'other';
    macros: {
      protein: number;
      carbs: number;
      fats: number;
      calories: number;
    };
    amount: number;
  }) => void;
  onClose: () => void;
}

export const CustomFoodInput: React.FC<CustomFoodInputProps> = ({ category, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'protein' | 'carbs' | 'other'>(category);
  const [amount, setAmount] = useState(100);
  const [macros, setMacros] = useState({
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    
    onSave({
      name,
      category: selectedCategory,
      macros,
      amount
    });
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const getCategoryIcon = () => {
    switch (selectedCategory) {
      case 'protein':
        return <Beef className="h-6 w-6 text-white" />;
      case 'carbs':
        return <Cookie className="h-6 w-6 text-white" />;
      case 'other':
        return <Apple className="h-6 w-6 text-white" />;
    }
  };

  const getCategoryColor = () => {
    switch (selectedCategory) {
      case 'protein':
        return 'from-purple-700 to-purple-800 border-purple-600';
      case 'carbs':
        return 'from-amber-700 to-amber-800 border-amber-600';
      case 'other':
        return 'from-green-700 to-green-800 border-green-600';
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl border-2 border-gray-700 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getCategoryColor()} p-5 flex items-center justify-between shadow-md`}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-black/20 shadow-inner backdrop-blur-sm">
            {getCategoryIcon()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">הוספת מזון מותאם אישית</h3>
            <p className="text-sm text-white/80">הגדר את פרטי המזון והמאקרו</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 hover:bg-black/20 rounded-lg transition-colors duration-200 text-white/90 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        {showSuccess && (
          <div className="mb-5 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-xl flex items-center gap-4 overflow-hidden animate-fade-in-up shadow-lg border border-green-600">
            <div className="p-4 bg-green-900/50 border-r border-green-600">
              <Check className="h-6 w-6" />
            </div>
            <div className="py-3.5 pr-3">
              <h4 className="font-semibold text-lg">המזון נוסף בהצלחה!</h4>
            </div>
          </div>
        )}

        <div className="space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-white">
                <span>שם המזון:</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border-2 border-gray-600 bg-gray-800/60 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-white placeholder-gray-400 shadow-inner"
                placeholder="הזן שם..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-white">
                <span>קטגוריה:</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as 'protein' | 'carbs' | 'other')}
                className="w-full p-3 border-2 border-gray-600 bg-gray-800/60 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-white shadow-inner"
              >
                <option value="protein">חלבון</option>
                <option value="carbs">פחמימה</option>
                <option value="other">אחר</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-white">
              <span>כמות סטנדרטית (גרם):</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-3 border-2 border-gray-600 bg-gray-800/60 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-white placeholder-gray-400 shadow-inner"
            />
            <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
              <Info className="h-4 w-4" />
              <span>זוהי כמות המזון הסטנדרטית במנה. לדוגמה: 100 גרם עבור בשר או 30 גרם לחם.</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/40 mb-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">הזן את ערכי המאקרו עבור הכמות שציינת (לא ל-100 גרם)</p>
                <p>לדוגמה: אם הכנסת כמות של 85 גרם חזה עוף, הזן את ערכי המאקרו ל-85 גרם, לא ל-100 גרם.</p>
              </div>
            </div>
          </div>

          {/* Macros Grid */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-white">
                <div className={`p-1.5 rounded-lg bg-purple-900 flex items-center justify-center`}>
                  <Beef className="h-3.5 w-3.5 text-purple-300" />
                </div>
                <span>חלבון (גרם):</span>
              </label>
              <input
                type="number"
                value={macros.protein}
                onChange={(e) => setMacros({ ...macros, protein: Number(e.target.value) })}
                className="w-full p-3 border-2 border-purple-700/50 bg-gray-800/60 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-white shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-white">
                <div className={`p-1.5 rounded-lg bg-amber-900 flex items-center justify-center`}>
                  <Cookie className="h-3.5 w-3.5 text-amber-300" />
                </div>
                <span>פחמימות (גרם):</span>
              </label>
              <input
                type="number"
                value={macros.carbs}
                onChange={(e) => setMacros({ ...macros, carbs: Number(e.target.value) })}
                className="w-full p-3 border-2 border-amber-700/50 bg-gray-800/60 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300 text-white shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-white">
                <div className={`p-1.5 rounded-lg bg-green-900 flex items-center justify-center`}>
                  <Coffee className="h-3.5 w-3.5 text-green-300" />
                </div>
                <span>שומן (גרם):</span>
              </label>
              <input
                type="number"
                value={macros.fats}
                onChange={(e) => setMacros({ ...macros, fats: Number(e.target.value) })}
                className="w-full p-3 border-2 border-green-700/50 bg-gray-800/60 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all duration-300 text-white shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-white">
                <div className={`p-1.5 rounded-lg bg-red-900 flex items-center justify-center`}>
                  <Coffee className="h-3.5 w-3.5 text-red-300" />
                </div>
                <span>קלוריות:</span>
              </label>
              <input
                type="number"
                value={macros.calories}
                onChange={(e) => setMacros({ ...macros, calories: Number(e.target.value) })}
                className="w-full p-3 border-2 border-red-700/50 bg-gray-800/60 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all duration-300 text-white shadow-inner"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-3 text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-xl transition-all duration-300 font-medium"
            >
              ביטול
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] text-white ${
                selectedCategory === 'protein'
                  ? 'bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 border-b-2 border-purple-900'
                  : selectedCategory === 'carbs'
                  ? 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 border-b-2 border-amber-900'
                  : 'bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 border-b-2 border-green-900'
              }`}
            >
              <Save className="h-5 w-5" />
              <span>שמור מזון</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};