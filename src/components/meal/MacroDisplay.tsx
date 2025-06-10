import React from 'react';
import { MacroNutrients, MacroRange } from '../../types/food';
import { Scale, Flame, Beef, Cookie } from 'lucide-react';

interface MacroDisplayProps {
  macroRange: MacroRange;
  title?: string;
  showTitle?: boolean;
}

export const MacroDisplay: React.FC<MacroDisplayProps> = ({ 
  macroRange, 
  title = "טווח מאקרו", 
  showTitle = true 
}) => {
  const formatNumber = (num: number) => Math.round(num);

  return (
    <div className="relative overflow-hidden">
      {showTitle && (
        <h3 className="text-lg font-semibold text-white mb-3 text-center">{title}</h3>
      )}
      
      <div className="flex flex-wrap gap-3 justify-center">
        {/* Protein Macro */}
        <div className="flex-1 min-w-[140px] bg-gradient-to-r from-purple-700/80 to-purple-800/80 rounded-xl shadow-lg border border-purple-600/50 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
          <div className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-800 shadow-md transform group-hover:rotate-12 transition-transform duration-300 border border-purple-500/30">
              <Beef className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-purple-300 font-medium">חלבון</div>
              <div className="text-lg font-bold text-white">
                {formatNumber(macroRange.min.protein)}-{formatNumber(macroRange.max.protein)}
                <span className="text-xs font-normal ml-1">גרם</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Carbs Macro */}
        <div className="flex-1 min-w-[140px] bg-gradient-to-r from-amber-700/80 to-amber-800/80 rounded-xl shadow-lg border border-amber-600/50 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
          <div className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-800 shadow-md transform group-hover:rotate-12 transition-transform duration-300 border border-amber-500/30">
              <Cookie className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-medium">פחמימות</div>
              <div className="text-lg font-bold text-white">
                {formatNumber(macroRange.min.carbs)}-{formatNumber(macroRange.max.carbs)}
                <span className="text-xs font-normal ml-1">גרם</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fats Macro */}
        <div className="flex-1 min-w-[140px] bg-gradient-to-r from-green-700/80 to-green-800/80 rounded-xl shadow-lg border border-green-600/50 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
          <div className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-800 shadow-md transform group-hover:rotate-12 transition-transform duration-300 border border-green-500/30">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-green-300 font-medium">שומן</div>
              <div className="text-lg font-bold text-white">
                {formatNumber(macroRange.min.fats)}-{formatNumber(macroRange.max.fats)}
                <span className="text-xs font-normal ml-1">גרם</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calories Macro */}
        <div className="flex-1 min-w-[140px] bg-gradient-to-r from-red-700/80 to-red-800/80 rounded-xl shadow-lg border border-red-600/50 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
          <div className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-800 shadow-md transform group-hover:rotate-12 transition-transform duration-300 border border-red-500/30">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-red-300 font-medium">קלוריות</div>
              <div className="text-lg font-bold text-white">
                {formatNumber(macroRange.min.calories)}-{formatNumber(macroRange.max.calories)}
                <span className="text-xs font-normal ml-1">קל'</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};