export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive' | 'attention';
  performance: number;
  team: 'beginner' | 'intermediate' | 'advanced';
  lastActive: string;
  overdueTasks: number;
  attentionNote: string | null;
  trainerId: string; // Reference to trainer ID
}