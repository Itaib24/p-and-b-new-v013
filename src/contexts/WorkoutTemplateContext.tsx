import React, { createContext, useContext, useState, useEffect } from 'react';
import { TrainingDay } from '../types/training';

interface WorkoutTemplate {
  id: string;
  name: string;
  day: TrainingDay;
  createdAt: string;
  lastUsed?: string;
}

interface WorkoutTemplateContextType {
  templates: WorkoutTemplate[];
  saveTemplate: (name: string, day: TrainingDay) => string;
  updateTemplate: (id: string, name: string, day: TrainingDay) => void;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => WorkoutTemplate | undefined;
  loadTemplates: () => void;
}

const WorkoutTemplateContext = createContext<WorkoutTemplateContextType | undefined>(undefined);

export const WorkoutTemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

  // Load templates from localStorage on first render
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    try {
      const savedTemplates = localStorage.getItem('workout-templates');
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  // Save templates to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('workout-templates', JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save templates:', error);
    }
  }, [templates]);

  const saveTemplate = (name: string, day: TrainingDay): string => {
    const id = `template-${Date.now()}`;
    const template: WorkoutTemplate = {
      id,
      name,
      day,
      createdAt: new Date().toISOString(),
    };
    
    setTemplates(prev => [...prev, template]);
    return id;
  };

  const updateTemplate = (id: string, name: string, day: TrainingDay) => {
    setTemplates(prev =>
      prev.map(template => {
        if (template.id === id) {
          return {
            ...template,
            name,
            day,
            lastUsed: new Date().toISOString()
          };
        }
        return template;
      })
    );
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  const getTemplateById = (id: string) => {
    return templates.find(template => template.id === id);
  };

  return (
    <WorkoutTemplateContext.Provider
      value={{
        templates,
        saveTemplate,
        updateTemplate,
        deleteTemplate,
        getTemplateById,
        loadTemplates
      }}
    >
      {children}
    </WorkoutTemplateContext.Provider>
  );
};

export const useWorkoutTemplate = () => {
  const context = useContext(WorkoutTemplateContext);
  if (context === undefined) {
    throw new Error('useWorkoutTemplate must be used within a WorkoutTemplateProvider');
  }
  return context;
};