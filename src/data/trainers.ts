import { User } from '../types/user';

export interface Trainer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'senior_trainer' | 'junior_trainer' | 'nutrition_specialist';
  status: 'active' | 'inactive' | 'training';
  specialties: string[];
  joinDate: string;
  clients: string[];
}

export const trainers: Trainer[] = [
  {
    id: 'trainer1',
    name: 'שרה יעקובוב',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'senior_trainer',
    status: 'active',
    specialties: ['weight_loss', 'strength_training'],
    joinDate: '2023-01-01',
    clients: ['1', '2']
  },
  {
    id: 'trainer2',
    name: 'מיכאל תורג׳מן',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'nutrition_specialist',
    status: 'active',
    specialties: ['nutrition', 'meal_planning'],
    joinDate: '2023-02-15',
    clients: ['3']
  }
];

// Helper functions
export const getTrainerById = (trainerId: string): Trainer | undefined => {
  return trainers.find(trainer => trainer.id === trainerId);
};

export const getTrainerByClientId = (clientId: string): Trainer | undefined => {
  return trainers.find(trainer => trainer.clients.includes(clientId));
};

export const getClientsByTrainerId = (trainerId: string): string[] => {
  const trainer = getTrainerById(trainerId);
  return trainer ? trainer.clients : [];
};