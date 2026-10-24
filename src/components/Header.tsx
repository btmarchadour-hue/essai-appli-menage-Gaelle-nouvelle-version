import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { ActiveTab } from '../types';
import { 
  Calendar, 
  Repeat, 
  Wrench, 
  Plus, 
  Settings2,
  Bell,
  BookOpen
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
    { id: 'agenda', label: 'Agenda & Corvées', icon: <Calendar className="w-4 h-4" /> },
    { 
      id: 'routines', 
      label: 'Routines (Draps, etc.)', 
      icon: <Repeat className="w-4 h-4" />,
      badge: routineCount > 0 ? routineCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300/60'
    },
    { 
      id: 'alerts', 
      label: 'Centre d’Alertes', 
      icon: <Bell className="w-4 h-4" />, 
      badge: alerts.length > 0 ? alerts.length : undefined,
      badgeColor: criticalAlertsCount > 0 ? 'bg-rose-500 text-white' : 'bg-amber-500 text-amber-950 font-bold'
    },
    { id: 'maison', label: 'Carnet Maison & Équipements', icon: <Wrench className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-amber-200/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 lg:gap-8">
          
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 font-black text-xl">
              🏡
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-amber-950 font-display leading-tight whitespace-nowrap">
                TribuMénage
              </span>
              <span className="text-[11px] font-medium text-stone-500 hidden sm:block">
                Mon Foyer Chaleureux · Agenda & Routines
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Desktop/Tablet) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-amber-50/70 p-1 rounded-2xl border border-amber-200/50">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 relative ${
                    isActive
                      ? 'bg-white text-amber-950 shadow-xs ring-1 ring-amber-300/60'
                      : 'text-stone-600 hover:text-amber-950 hover:bg-white/60'
                  }`}
                >
                  <span className={isActive ? 'text-amber-700' : 'text-stone-400'}>
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
            
            {/* Guide direct link */}
            <a
              href="#guide-utilisateur"
              title="Consulter le Guide d'utilisation"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-700 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 rounded-xl transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Guide</span>
            </a>

            {/* Quick Alert Bell button on mobile */}
            <button
              onClick={() => setActiveTab('alerts')}
              title={`${alerts.length} alerte(s) active(s)`}
              aria-label="Alertes"
              className="md:hidden relative p-2 text-stone-600 hover:bg-amber-50 rounded-xl"
            >
              <Bell className="w-4 h-4 text-stone-700" />
              {alerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* Settings & Backup Modal */}
            <button
              onClick={onOpenBackup}
              title="Sauvegardes et réinitialisation"
              aria-label="Paramètres et sauvegarde"
              className="p-2 text-stone-500 hover:text-amber-950 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 rounded-xl shadow-sm shadow-orange-500/20 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
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
