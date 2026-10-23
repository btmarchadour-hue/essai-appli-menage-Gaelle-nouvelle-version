import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { ActiveTab } from '../types';
import { 
  Calendar, 
  Repeat, 
  Wrench, 
  Plus, 
  Settings2,
  Bell
} from 'lucide-react';

interface HeaderProps {
  onOpenQuickAdd: () => void;
  onOpenBackup: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenQuickAdd, 
  onOpenBackup 
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    alerts,
    criticalAlertsCount,
    tasks
  } = useHousehold();

  const routineCount = tasks.filter(t => t.isRoutine).length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'agenda', label: 'Agenda & Tâches', icon: <Calendar className="w-4 h-4" /> },
    { 
      id: 'routines', 
      label: 'Routines (Draps, etc.)', 
      icon: <Repeat className="w-4 h-4" />,
      badge: routineCount > 0 ? routineCount : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    { 
      id: 'alerts', 
      label: 'Centre d’Alertes', 
      icon: <Bell className="w-4 h-4" />, 
      badge: alerts.length > 0 ? alerts.length : undefined,
      badgeColor: criticalAlertsCount > 0 ? 'bg-rose-500 text-white' : 'bg-amber-400 text-amber-950'
    },
    { id: 'maison', label: 'Carnet Maison & Équipements', icon: <Wrench className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 lg:gap-8">
          
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-500 flex items-center justify-center text-white shadow-sm font-black text-lg">
              🧹
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 font-display leading-tight whitespace-nowrap">
                Gestion Ménage & Maison
              </span>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Agenda · Routines · Carnet d'entretien
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Desktop/Tablet) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 relative ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full font-mono ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Controls */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Quick Alert Bell button on mobile */}
            <button
              onClick={() => setActiveTab('alerts')}
              title={`${alerts.length} alerte(s) active(s)`}
              aria-label="Alertes"
              className="md:hidden relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* Settings & Backup Modal */}
            <button
              onClick={onOpenBackup}
              title="Sauvegardes et réinitialisation"
              aria-label="Paramètres et sauvegarde"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/20 active:scale-95 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Créer une tâche</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
