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
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-10">
      
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
      </main>

      {/* Mobile Bottom Bar */}
      <MobileBottomNav />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Gestion Ménage & Maison</span>
            <span aria-hidden="true">·</span>
            <span>Organisation des tâches par Agenda, Routines périodiques et Carnet d'entretien</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsBackupOpen(true)}
              className="hover:text-slate-700 transition-colors"
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
