import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { ActiveTab } from '../types';
import { Calendar, Repeat, Bell, Wrench } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, alerts, criticalAlertsCount } = useHousehold();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'agenda', label: 'Agenda', icon: <Calendar className="w-5 h-5" /> },
    { id: 'routines', label: 'Routines', icon: <Repeat className="w-5 h-5" /> },
    { 
      id: 'alerts', 
      label: 'Alertes', 
      icon: <Bell className="w-5 h-5" />, 
      badge: alerts.length 
    },
    { id: 'maison', label: 'Maison', icon: <Wrench className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-all relative ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg relative ${isActive ? 'bg-indigo-50 scale-105 transition-transform' : ''}`}>
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`absolute -top-1 -right-1 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center text-white ${
                    criticalAlertsCount > 0 ? 'bg-rose-500' : 'bg-amber-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
