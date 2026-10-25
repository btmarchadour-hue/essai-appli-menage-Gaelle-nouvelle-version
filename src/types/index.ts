export type RoomType = 
  | 'cuisine' 
  | 'salon' 
  | 'chambres' 
  | 'salle_de_bain' 
  | 'exterieur' 
  | 'entree' 
  | 'toute_la_maison';

export type TaskDifficulty = 'facile' | 'moyen' | 'costaud';
export type TaskFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'as_needed' | 'custom_days';
export type TimeOfDay = 'matin' | 'apres_midi' | 'soir' | 'libre';

export interface ChoreTask {
  id: string;
  title: string;
  description?: string;
  room: RoomType;
  frequency: TaskFrequency;
  difficulty?: TaskDifficulty;
  completed: boolean;
  completedAt?: string;
  dueDate: string; // YYYY-MM-DD
  timeOfDay: TimeOfDay;
  urgent?: boolean;

  // Recurrence / Routine features
  isRoutine?: boolean;
  intervalDays?: number; // e.g. 15 for "changer les draps tous les 15 jours"
  lastCompletedDate?: string; // YYYY-MM-DD
}

export type EquipmentCategory = 'electromenager' | 'chauffage' | 'plomberie' | 'jardin' | 'vehicule';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  location: string;
  lastMaintenanceDate: string; // YYYY-MM-DD
  frequencyDays: number;
  instructions: string;
  urgent?: boolean;
}

export type Season = 'printemps' | 'ete' | 'automne' | 'hiver';

export interface SeasonalTask {
  id: string;
  season: Season;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string; // YYYY-MM-DD
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface HouseholdAlert {
  id: string;
  sourceType: 'task' | 'equipment' | 'seasonal' | 'routine';
  sourceId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  dueDate: string;
  actionLabel?: string;
}

export type ActiveTab = 'agenda' | 'tasks' | 'alerts' | 'guide' | 'routines' | 'maison';
