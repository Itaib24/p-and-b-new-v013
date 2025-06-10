import React, { createContext, useContext, useState, useEffect } from 'react';
import { TrainingDay } from '../types/training';

interface WorkoutPlanTemplate {
  id: string;
  name: string;
  plan: TrainingDay[];
  createdAt: string;
  lastUsed?: string;
  description?: string;
}

interface WorkoutPlanTemplateContextType {
  planTemplates: WorkoutPlanTemplate[];
  savePlanTemplate: (name: string, plan: TrainingDay[], description?: string) => string;
  updatePlanTemplate: (id: string, name: string, plan: TrainingDay[], description?: string) => void;
  deletePlanTemplate: (id: string) => void;
  getPlanTemplateById: (id: string) => WorkoutPlanTemplate | undefined;
  loadPlanTemplates: () => void;
}

const WorkoutPlanTemplateContext = createContext<WorkoutPlanTemplateContextType | undefined>(undefined);

export const WorkoutPlanTemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [planTemplates, setPlanTemplates] = useState<WorkoutPlanTemplate[]>([]);

  // Load templates from localStorage on first render
  useEffect(() => {
    loadPlanTemplates();
  }, []);

  const loadPlanTemplates = () => {
    try {
      const savedTemplates = localStorage.getItem('workout-plan-templates');
      if (savedTemplates) {
        setPlanTemplates(JSON.parse(savedTemplates));
      }
    } catch (error) {
      console.error('Failed to load plan templates:', error);
    }
  };

  // Save templates to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('workout-plan-templates', JSON.stringify(planTemplates));
    } catch (error) {
      console.error('Failed to save plan templates:', error);
    }
  }, [planTemplates]);

  const savePlanTemplate = (name: string, plan: TrainingDay[], description?: string): string => {
    const id = `plan-template-${Date.now()}`;
    const template: WorkoutPlanTemplate = {
      id,
      name,
      plan: JSON.parse(JSON.stringify(plan)), // Deep copy to avoid references
      createdAt: new Date().toISOString(),
      description
    };
    
    setPlanTemplates(prev => [...prev, template]);
    return id;
  };

  const updatePlanTemplate = (id: string, name: string, plan: TrainingDay[], description?: string) => {
    setPlanTemplates(prev =>
      prev.map(template => {
        if (template.id === id) {
          return {
            ...template,
            name,
            plan: JSON.parse(JSON.stringify(plan)), // Deep copy to avoid references
            lastUsed: new Date().toISOString(),
            description
          };
        }
        return template;
      })
    );
  };

  const deletePlanTemplate = (id: string) => {
    setPlanTemplates(prev => prev.filter(template => template.id !== id));
  };

  const getPlanTemplateById = (id: string) => {
    return planTemplates.find(template => template.id === id);
  };

  return (
    <WorkoutPlanTemplateContext.Provider
      value={{
        planTemplates,
        savePlanTemplate,
        updatePlanTemplate,
        deletePlanTemplate,
        getPlanTemplateById,
        loadPlanTemplates
      }}
    >
      {children}
    </WorkoutPlanTemplateContext.Provider>
  );
};

export const useWorkoutPlanTemplate = () => {
  const context = useContext(WorkoutPlanTemplateContext);
  if (context === undefined) {
    throw new Error('useWorkoutPlanTemplate must be used within a WorkoutPlanTemplateProvider');
  }
  return context;
};