import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ChoreTask,
  Equipment,
  SeasonalTask,
  ActiveTab,
  HouseholdAlert,
} from '../types';
import {
  INITIAL_TASKS,
  INITIAL_EQUIPMENT,
  INITIAL_SEASONAL_TASKS,
} from '../data/initialData';
import { triggerChoreConfetti } from '../utils/confetti';
import { getRandomChuckNorrisQuote } from '../data/chuckNorrisQuotes';

export interface CongratulationEvent {
  id: string;
  taskTitle: string;
  quote: string;
  timestamp: number;
}

interface HouseholdState {
  tasks: ChoreTask[];
  equipment: Equipment[];
  seasonalTasks: SeasonalTask[];
  activeTab: ActiveTab; // 'agenda' | 'alerts' | 'routines' | 'maison'
  selectedDate: string; // YYYY-MM-DD
}

interface HouseholdContextType extends HouseholdState {
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedDate: (date: string) => void;
  
  // Alerts
  alerts: HouseholdAlert[];
  criticalAlertsCount: number;

  // Congratulation (Chuck Norris fact)
  congratulation: CongratulationEvent | null;
  dismissCongratulation: () => void;
  shuffleCongratulationQuote: () => void;
  triggerCongratulations: (taskTitle?: string) => void;
  
  // Tasks & Routines
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<ChoreTask, 'id' | 'completed'>) => void;
  editTask: (task: ChoreTask) => void;
  deleteTask: (taskId: string) => void;
  bulkDeleteTasks: (taskIds: string[]) => void;
  clearAllTasks: () => void;
  loadMinimalTasks: () => void;
  postponeTask: (taskId: string, daysToAdd?: number) => void;
  renewRoutine: (taskId: string) => void;
  
  // Maintenance & Seasons
  addEquipment: (item: Omit<Equipment, 'id'>) => void;
  recordMaintenance: (id: string) => void;
  deleteEquipment: (id: string) => void;
  toggleSeasonalTask: (id: string) => void;
  
  // Data Tools
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'cleanhome_menage_maison_v7_user_exact_8';
export const TODAY_STR = '2026-10-20'; // Current application date anchor

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

export const HouseholdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<HouseholdState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          tasks: parsed.tasks || INITIAL_TASKS,
          equipment: parsed.equipment || INITIAL_EQUIPMENT,
          seasonalTasks: parsed.seasonalTasks || INITIAL_SEASONAL_TASKS,
          activeTab: 'agenda',
          selectedDate: TODAY_STR,
        };
      }
    } catch {
      // ignore
    }
    return {
      tasks: INITIAL_TASKS,
      equipment: INITIAL_EQUIPMENT,
      seasonalTasks: INITIAL_SEASONAL_TASKS,
      activeTab: 'agenda',
      selectedDate: TODAY_STR,
    };
  });

  // Chuck Norris congratulations toast state
  const [congratulation, setCongratulation] = useState<CongratulationEvent | null>(null);

  const triggerCongratulations = (taskTitle: string = 'Une corvée du foyer') => {
    triggerChoreConfetti();
    setCongratulation({
      id: `cong-${Date.now()}-${Math.random()}`,
      taskTitle,
      quote: getRandomChuckNorrisQuote(),
      timestamp: Date.now(),
    });
  };

  const dismissCongratulation = () => {
    setCongratulation(null);
  };

  const shuffleCongratulationQuote = () => {
    setCongratulation(prev => {
      if (!prev) return null;
      return {
        ...prev,
        quote: getRandomChuckNorrisQuote(prev.quote),
      };
    });
  };

  // Save changes to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        tasks: state.tasks,
        equipment: state.equipment,
        seasonalTasks: state.seasonalTasks,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // ignore
    }
  }, [state.tasks, state.equipment, state.seasonalTasks]);

  const setActiveTab = (tab: ActiveTab) => {
    setState(s => ({ ...s, activeTab: tab }));
  };

  const setSelectedDate = (date: string) => {
    setState(s => ({ ...s, selectedDate: date }));
  };

  // Compute live Household Alerts from tasks, equipment, and seasonal checklists
  const alerts: HouseholdAlert[] = useMemo(() => {
    const list: HouseholdAlert[] = [];
    const today = new Date(TODAY_STR);

    // 1. Task Overdue Alerts
    state.tasks.forEach(t => {
      if (!t.completed) {
        const taskDue = new Date(t.dueDate);
        const diffDays = Math.floor((today.getTime() - taskDue.getTime()) / (1000 * 3600 * 24));

        if (diffDays > 0) {
          list.push({
            id: `alert-task-${t.id}`,
            sourceType: t.isRoutine ? 'routine' : 'task',
            sourceId: t.id,
            title: `Retard : ${t.title}`,
            message: t.isRoutine 
              ? `Cette routine a dépassé son échéance maximale depuis ${diffDays} jour(s).`
              : `Corvée prévue le ${t.dueDate} non effectuée (${diffDays} j de retard).`,
            severity: diffDays >= 2 ? 'critical' : 'warning',
            dueDate: t.dueDate,
            actionLabel: 'Reporter ou Valider',
          });
        }
      }
    });

    // 2. Equipment Maintenance Due Alerts
    state.equipment.forEach(eq => {
      const last = new Date(eq.lastMaintenanceDate);
      const nextDue = new Date(last);
      nextDue.setDate(last.getDate() + eq.frequencyDays);

      const diffDays = Math.floor((today.getTime() - nextDue.getTime()) / (1000 * 3600 * 24));
      const nextDueStr = nextDue.toISOString().split('T')[0];

      if (diffDays >= 0) {
        list.push({
          id: `alert-eq-${eq.id}`,
          sourceType: 'equipment',
          sourceId: eq.id,
          title: `Entretien dû : ${eq.name}`,
          message: diffDays === 0 
            ? `Entretien prévu aujourd'hui (${eq.instructions.slice(0, 70)}...)`
            : `Entretien dépassé depuis ${diffDays} jour(s).`,
          severity: diffDays > 14 ? 'critical' : 'warning',
          dueDate: nextDueStr,
          actionLabel: 'Enregistrer révision',
        });
      } else if (diffDays >= -7) {
        list.push({
          id: `alert-eq-soon-${eq.id}`,
          sourceType: 'equipment',
          sourceId: eq.id,
          title: `À prévoir : ${eq.name}`,
          message: `Entretien dans ${Math.abs(diffDays)} jour(s) (${nextDueStr}).`,
          severity: 'info',
          dueDate: nextDueStr,
          actionLabel: 'Consulter fiche',
        });
      }
    });

    // 3. Seasonal Tasks Alerts
    state.seasonalTasks.forEach(st => {
      if (!st.completed && st.dueDate) {
        const due = new Date(st.dueDate);
        const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 3600 * 24));

        if (diffDays > 0) {
          list.push({
            id: `alert-season-${st.id}`,
            sourceType: 'seasonal',
            sourceId: st.id,
            title: `Saison : ${st.title}`,
            message: `Tâche saisonnière en retard (${st.season.toUpperCase()}).`,
            severity: 'warning',
            dueDate: st.dueDate,
            actionLabel: 'Valider',
          });
        }
      }
    });

    return list.sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2 };
      return order[a.severity] - order[b.severity];
    });
  }, [state.tasks, state.equipment, state.seasonalTasks]);

  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical').length;

  // Toggle task completion
  const toggleTask = (taskId: string) => {
    setState(prev => {
      const target = prev.tasks.find(t => t.id === taskId);
      if (!target) return prev;

      const willBeCompleted = !target.completed;
      if (willBeCompleted) {
        triggerCongratulations(target.title);
      }

      return {
        ...prev,
        tasks: prev.tasks.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              completed: willBeCompleted,
              completedAt: willBeCompleted ? new Date().toISOString() : undefined,
              lastCompletedDate: willBeCompleted ? TODAY_STR : t.lastCompletedDate,
            };
          }
          return t;
        }),
      };
    });
  };

  // Renew a routine: mark current completed and create next scheduled task
  const renewRoutine = (taskId: string) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task || !task.intervalDays) return prev;

      triggerCongratulations(task.title);

      // Calculate next due date: TODAY + intervalDays
      const nextDate = new Date(TODAY_STR);
      nextDate.setDate(nextDate.getDate() + task.intervalDays);
      const nextDateStr = nextDate.toISOString().split('T')[0];

      // Mark current as completed
      const updatedTasks = prev.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            completed: true,
            completedAt: new Date().toISOString(),
            lastCompletedDate: TODAY_STR,
          };
        }
        return t;
      });

      // Spawn next occurrence
      const nextOccurrence: ChoreTask = {
        ...task,
        id: `routine-${Date.now()}`,
        completed: false,
        completedAt: undefined,
        dueDate: nextDateStr,
        lastCompletedDate: TODAY_STR,
      };

      return {
        ...prev,
        tasks: [...updatedTasks, nextOccurrence],
      };
    });
  };

  const postponeTask = (taskId: string, daysToAdd: number = 1) => {
    setState(prev => {
      return {
        ...prev,
        tasks: prev.tasks.map(t => {
          if (t.id === taskId) {
            const current = new Date(t.dueDate);
            current.setDate(current.getDate() + daysToAdd);
            const newDateStr = current.toISOString().split('T')[0];
            return {
              ...t,
              dueDate: newDateStr,
            };
          }
          return t;
        }),
      };
    });
  };

  const addTask = (newTask: Omit<ChoreTask, 'id' | 'completed'>) => {
    const task: ChoreTask = {
      ...newTask,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setState(prev => ({
      ...prev,
      tasks: [task, ...prev.tasks],
    }));
  };

  const editTask = (updatedTask: ChoreTask) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)),
    }));
  };

  const deleteTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId),
    }));
  };

  const bulkDeleteTasks = (taskIds: string[]) => {
    const set = new Set(taskIds);
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => !set.has(t.id)),
    }));
  };

  const clearAllTasks = () => {
    setState(prev => ({
      ...prev,
      tasks: [],
    }));
  };

  const loadMinimalTasks = () => {
    setState(prev => ({
      ...prev,
      tasks: INITIAL_TASKS,
    }));
  };

  // Maintenance & Seasons
  const addEquipment = (item: Omit<Equipment, 'id'>) => {
    const newEq: Equipment = {
      ...item,
      id: `eq-${Date.now()}`,
    };
    setState(prev => ({
      ...prev,
      equipment: [...prev.equipment, newEq],
    }));
  };

  const recordMaintenance = (id: string) => {
    const eq = state.equipment.find(item => item.id === id);
    if (eq) {
      triggerCongratulations(`Entretien : ${eq.name}`);
    } else {
      triggerChoreConfetti();
    }

    setState(prev => ({
      ...prev,
      equipment: prev.equipment.map(item => {
        if (item.id === id) {
          return {
            ...item,
            lastMaintenanceDate: TODAY_STR,
            urgent: false,
          };
        }
        return item;
      }),
    }));
  };

  const deleteEquipment = (id: string) => {
    setState(prev => ({
      ...prev,
      equipment: prev.equipment.filter(eq => eq.id !== id),
    }));
  };

  const toggleSeasonalTask = (id: string) => {
    const target = state.seasonalTasks.find(item => item.id === id);
    if (target && !target.completed) {
      triggerCongratulations(target.title);
    }

    setState(prev => ({
      ...prev,
      seasonalTasks: prev.seasonalTasks.map(st => {
        if (st.id === id) {
          const willBeDone = !st.completed;
          return {
            ...st,
            completed: willBeDone,
            completedAt: willBeDone ? new Date().toISOString() : undefined,
          };
        }
        return st;
      }),
    }));
  };

  // Export / Import / Reset
  const exportData = () => {
    return JSON.stringify({
      tasks: state.tasks,
      equipment: state.equipment,
      seasonalTasks: state.seasonalTasks,
      exportDate: new Date().toISOString(),
      version: '5.0-maison',
    }, null, 2);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.tasks)) {
        setState(prev => ({
          ...prev,
          tasks: data.tasks,
          equipment: Array.isArray(data.equipment) ? data.equipment : prev.equipment,
          seasonalTasks: Array.isArray(data.seasonalTasks) ? data.seasonalTasks : prev.seasonalTasks,
        }));
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const resetToDefaults = () => {
    setState({
      tasks: INITIAL_TASKS,
      equipment: INITIAL_EQUIPMENT,
      seasonalTasks: INITIAL_SEASONAL_TASKS,
      activeTab: 'agenda',
      selectedDate: TODAY_STR,
    });
  };

  return (
    <HouseholdContext.Provider
      value={{
        ...state,
        setActiveTab,
        setSelectedDate,
        alerts,
        criticalAlertsCount,
        congratulation,
        dismissCongratulation,
        shuffleCongratulationQuote,
        triggerCongratulations,
        toggleTask,
        addTask,
        editTask,
        deleteTask,
        bulkDeleteTasks,
        clearAllTasks,
        loadMinimalTasks,
        postponeTask,
        renewRoutine,
        addEquipment,
        recordMaintenance,
        deleteEquipment,
        toggleSeasonalTask,
        exportData,
        importData,
        resetToDefaults,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
};

export const useHousehold = () => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }
  return context;
};
