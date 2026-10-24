import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { ActiveTab } from '../types';
import { Calendar, Repeat, Bell, Wrench, BookOpen } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, alerts, criticalAlertsCount } = useHousehold();
  const [guideHighlighted, setGuideHighlighted] = useState(false);

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

  const handleGuideClick = () => {
    setGuideHighlighted(true);
    setTimeout(() => setGuideHighlighted(false), 1500);
    const el = document.getElementById('guide-utilisateur');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-amber-200/70 shadow-[0_-4px_20px_rgba(217,119,6,0.08)]">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1.5">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-all relative cursor-pointer active:scale-95 ${
                isActive
                  ? 'text-amber-900 font-bold'
                  : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              <div className={`p-1 rounded-xl relative transition-all ${
                isActive ? 'bg-amber-100 text-amber-800 scale-105 shadow-2xs ring-1 ring-amber-300/60' : ''
              }`}>
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`absolute -top-1 -right-1 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center text-white ${
                    criticalAlertsCount > 0 ? 'bg-rose-500' : 'bg-amber-600'
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

        {/* 5th Button: Guide (Thumb-friendly directly to bottom guide) */}
        <button
          onClick={handleGuideClick}
          className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-all relative cursor-pointer active:scale-95 ${
            guideHighlighted
              ? 'text-amber-900 font-bold'
              : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
          title="Consulter le Guide d'utilisation"
        >
          <div className={`p-1 rounded-xl relative transition-all ${
            guideHighlighted ? 'bg-amber-100 text-amber-800 scale-105 shadow-2xs ring-1 ring-amber-300/60' : ''
          }`}>
            <BookOpen className="w-5 h-5 text-amber-700" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-none">
            Guide
          </span>
        </button>
      </div>
    </nav>
  );
};
