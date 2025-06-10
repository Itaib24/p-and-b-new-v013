import React, { useState } from 'react';
import { ExerciseOption, exerciseCategories } from '../../types/training';
import { getExercisesByCategory } from '../../data/exerciseDatabase';
import { Dumbbell, Search, Filter, X, Check, ChevronRight } from 'lucide-react';

interface ExerciseSelectorProps {
  onExerciseSelect: (exercise: ExerciseOption) => void;
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  onExerciseSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredExercise, setHoveredExercise] = useState<string | null>(null);
  
  const hebrewCategories = {
    chest: 'חזה',
    back: 'גב',
    legs: 'רגליים',
    shoulders: 'כתפיים',
    arms: 'ידיים',
    abs: 'בטן',
    cardio: 'קרדיו'
  };

  const categoryIcons = {
    chest: "💪",
    back: "🏋️",
    legs: "🦵",
    shoulders: "🏆",
    arms: "💪",
    abs: "🏅",
    cardio: "🏃"
  };

  // Filter exercises based on search term and selected category
  const getFilteredExercises = () => {
    let filteredExercises: ExerciseOption[] = [];
    
    // If a category is selected, only get exercises from that category
    if (selectedCategory) {
      filteredExercises = getExercisesByCategory(selectedCategory);
    } else {
      // Otherwise, get all exercises
      Object.keys(exerciseCategories).forEach(category => {
        filteredExercises = [...filteredExercises, ...getExercisesByCategory(category)];
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      filteredExercises = filteredExercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredExercises;
  };
  
  const filteredExercises = getFilteredExercises();

  return (
    <div className="max-h-[calc(70vh-100px)] overflow-hidden flex flex-col">
      {/* Search and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 sticky top-0 z-10 bg-gray-800/90 p-3 rounded-xl backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="חפש תרגילים..."
            className="w-full pl-12 pr-12 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 placeholder-gray-400"
          />
        </div>
        
        <div className="relative min-w-[180px]">
          <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="w-full appearance-none pl-4 pr-12 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
          >
            <option value="">כל הקטגוריות</option>
            {Object.entries(exerciseCategories).map(([category, _]) => (
              <option key={category} value={category}>
                {hebrewCategories[category as keyof typeof hebrewCategories]}
              </option>
            ))}
          </select>
          <ChevronRight className="absolute left-4 top-1/2 transform -translate-y-1/2 rotate-90 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {Object.entries(exerciseCategories).map(([category, _]) => (
          <button
            key={category}
            className={`flex items-center justify-center p-3 rounded-xl transition-all duration-200 border-2 ${
              selectedCategory === category 
                ? 'bg-purple-700 border-purple-600 text-white shadow-lg transform -translate-y-1' 
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
            }`}
            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
          >
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl mb-1">{categoryIcons[category as keyof typeof categoryIcons]}</span>
              <span className="text-sm font-medium">
                {hebrewCategories[category as keyof typeof hebrewCategories]}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Search Results Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h4 className="font-medium text-gray-300">
          {searchTerm || selectedCategory
            ? `${filteredExercises.length} תרגילים נמצאו`
            : 'כל התרגילים'
          }
        </h4>
        
        {(searchTerm || selectedCategory) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory(null);
            }}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 flex items-center gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            <span>נקה סינון</span>
          </button>
        )}
      </div>
      
      {/* Exercise List */}
      <div className="overflow-y-auto pr-2 flex-1">
        {filteredExercises.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto bg-gray-800/60 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <Dumbbell className="h-8 w-8 text-gray-500" />
            </div>
            <h5 className="text-lg font-semibold text-gray-300 mb-2">לא נמצאו תרגילים</h5>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              נסה לשנות את מונחי החיפוש או לבחור קטגוריה אחרת
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredExercises.map(exercise => (
              <button
                key={exercise.id}
                className={`flex items-center gap-3 p-4 bg-gradient-to-r from-gray-700/80 to-gray-800/80 rounded-xl border-2 ${
                  hoveredExercise === exercise.id 
                    ? 'border-purple-500 shadow-xl' 
                    : 'border-gray-700 shadow-md'
                } hover:border-purple-500 text-left transition-all duration-200 transform ${
                  hoveredExercise === exercise.id ? 'scale-[1.02]' : ''
                }`}
                onClick={() => onExerciseSelect(exercise)}
                onMouseEnter={() => setHoveredExercise(exercise.id)}
                onMouseLeave={() => setHoveredExercise(null)}
              >
                <div className="p-2.5 bg-gradient-to-r from-purple-700 to-purple-600 rounded-lg shadow-md flex-shrink-0">
                  <Dumbbell className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h5 className="font-medium text-white text-lg truncate">{exercise.name}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="inline-flex items-center px-2 py-1 bg-purple-900/40 text-purple-300 text-xs rounded-md border border-purple-800/30">
                      {exercise.defaultSets.replace(' sets', '')} סטים
                    </div>
                    <div className="inline-flex items-center px-2 py-1 bg-green-900/40 text-green-300 text-xs rounded-md border border-green-800/30">
                      {exercise.defaultReps.replace(' reps', '')} חזרות
                    </div>
                  </div>
                </div>
                
                {hoveredExercise === exercise.id && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-green-500 rounded-full p-1.5 border-2 border-white shadow-md animate-fade-in-up">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};