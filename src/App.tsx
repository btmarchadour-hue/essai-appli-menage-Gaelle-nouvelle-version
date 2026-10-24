import React, { useState } from 'react';
import { HouseholdProvider, useHousehold } from './context/HouseholdContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AgendaView } from './components/views/AgendaView';
import { AlertsCenterView } from './components/views/AlertsCenterView';
import { RoutinesView } from './components/views/RoutinesView';
import { HomeCareView } from './components/views/HomeCareView';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { BackupModal } from './components/modals/BackupModal';
import { ChuckCelebrationToast } from './components/ChuckCelebrationToast';
import { UserGuideFooter } from './components/UserGuideFooter';

const MainContent: React.FC = () => {
  const { activeTab } = useHousehold();

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDefaultType, setQuickAddDefaultType] = useState<'task' | 'equipment'>('task');
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const openQuickAdd = (type: 'task' | 'equipment' = 'task') => {
    setQuickAddDefaultType(type);
    setIsQuickAddOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col pb-24 md:pb-12">
      
      {/* Header with Navigation and Alerts */}
      <Header
        onOpenQuickAdd={() => openQuickAdd('task')}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'agenda' && (
          <AgendaView onOpenAddTask={() => openQuickAdd('task')} />
        )}
        {activeTab === 'routines' && (
          <RoutinesView onOpenCreateRoutine={() => openQuickAdd('task')} />
        )}
        {activeTab === 'alerts' && (
          <AlertsCenterView />
        )}
        {activeTab === 'maison' && (
          <HomeCareView onOpenAddEquipment={() => openQuickAdd('equipment')} />
        )}

        {/* User Guide: Mobile-first & positioned at the bottom of the page */}
        <UserGuideFooter />
      </main>

      {/* Mobile Bottom Bar */}
      <MobileBottomNav />

      {/* Footer */}
      <footer className="border-t border-amber-200/70 bg-[#FFFDF9] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <span>🏡</span>
              <span>TribuMénage · Mon Foyer Chaleureux</span>
            </span>
            <span aria-hidden="true" className="text-amber-300">·</span>
            <span>Organisation sereine du foyer & corvées en famille</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <a
              href="#guide-utilisateur"
              className="hover:text-amber-900 font-medium transition-colors"
            >
              Guide utilisateur
            </a>
            <span aria-hidden="true" className="text-amber-300">·</span>
            <button
              onClick={() => setIsBackupOpen(true)}
              className="hover:text-amber-900 font-medium transition-colors cursor-pointer"
            >
              Sauvegarder & Exporter (JSON)
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultType={quickAddDefaultType}
      />
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />

      {/* Chuck Norris Congratulatory Toast */}
      <ChuckCelebrationToast />

    </div>
  );
};

export default function App() {
  return (
    <HouseholdProvider>
      <MainContent />
    </HouseholdProvider>
  );
}
