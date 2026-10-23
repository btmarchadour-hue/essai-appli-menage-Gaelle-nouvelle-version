import React, { useState, useMemo } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { Equipment, EquipmentCategory, Season } from '../../types';
import { 
  Wrench, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Check, 
  Trash2, 
  Leaf, 
  Sun, 
  CloudSnow, 
  Wind 
} from 'lucide-react';

const CATEGORY_NAMES: Record<EquipmentCategory, { label: string; icon: string }> = {
  electromenager: { label: 'Électroménager', icon: '⚡' },
  chauffage: { label: 'Chauffage & Climatisation', icon: '🔥' },
  plomberie: { label: 'Plomberie & Eau', icon: '🚰' },
  jardin: { label: 'Jardin & Extérieur', icon: '🌱' },
  vehicule: { label: 'Véhicules & Mobilité', icon: '🚗' },
};

const SEASONS: { id: Season; label: string; icon: string; months: string }[] = [
  { id: 'automne', label: 'Automne', icon: '🍁', months: 'Sept - Nov' },
  { id: 'hiver', label: 'Hiver', icon: '❄️', months: 'Déc - Fév' },
  { id: 'printemps', label: 'Printemps', icon: '🌸', months: 'Mars - Mai' },
  { id: 'ete', label: 'Été', icon: '☀️', months: 'Juin - Août' },
];

interface HomeCareViewProps {
  onOpenAddEquipment: () => void;
}

export const HomeCareView: React.FC<HomeCareViewProps> = ({ onOpenAddEquipment }) => {
  const {
    equipment,
    seasonalTasks,
    recordMaintenance,
    deleteEquipment,
    toggleSeasonalTask,
  } = useHousehold();

  // Current month determines the default season
  const [activeSeason, setActiveSeason] = useState<Season>('automne');
  const [activeSubTab, setActiveSubTab] = useState<'equipment' | 'seasons'>('equipment');

  // Enriched equipment with countdown
  const enrichedEquipment = useMemo(() => {
    const today = new Date();
    return equipment.map(item => {
      const lastDate = new Date(item.lastMaintenanceDate);
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + item.frequencyDays);

      const diffTime = nextDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isOverdue = daysLeft < 0;
      const isUrgent = daysLeft >= 0 && daysLeft <= 7;

      return {
        ...item,
        nextMaintenanceDate: nextDate.toISOString().split('T')[0],
        daysLeft,
        isOverdue,
        isUrgent,
      };
    });
  }, [equipment]);

  const filteredSeasonalTasks = useMemo(() => {
    return seasonalTasks.filter(t => t.season === activeSeason);
  }, [seasonalTasks, activeSeason]);

  const stats = useMemo(() => {
    const totalEquipment = equipment.length;
    const overdueCount = enrichedEquipment.filter(e => e.isOverdue).length;
    const urgentCount = enrichedEquipment.filter(e => e.isUrgent).length;
    const seasonTotal = filteredSeasonalTasks.length;
    const seasonCompleted = filteredSeasonalTasks.filter(t => t.completed).length;

    return { totalEquipment, overdueCount, urgentCount, seasonTotal, seasonCompleted };
  }, [equipment, enrichedEquipment, filteredSeasonalTasks]);

  return (
    <div className="space-y-6">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-700 via-slate-800 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🛠️</span>
              <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight">
                Carnet d'Entretien & Checklists Maison
              </h1>
            </div>
            <p className="text-teal-100 text-sm max-w-2xl">
              Préservez vos appareils, anticipez les pannes et gardez une maison saine au fil des 4 saisons.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenAddEquipment}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 hover:bg-teal-50 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Ajouter un Appareil</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs: Equipment vs Seasons */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/20">
          <button
            onClick={() => setActiveSubTab('equipment')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'equipment'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-teal-100 hover:bg-white/10'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Équipements & Filtres ({equipment.length})</span>
            {stats.overdueCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {stats.overdueCount} en retard
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('seasons')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'seasons'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-teal-100 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Checklists Saisonnières ({stats.seasonCompleted}/{stats.seasonTotal})</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: EQUIPMENT MAINTENANCE */}
      {activeSubTab === 'equipment' && (
        <div className="space-y-4">
          
          {stats.overdueCount > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-950 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div className="text-xs">
                <strong className="block text-sm font-bold text-rose-900">Entretien en retard !</strong>
                <span>{stats.overdueCount} appareil(s) nécessitent un contrôle ou nettoyage rapide.</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrichedEquipment.map(item => {
              const catInfo = CATEGORY_NAMES[item.category] || { label: item.category, icon: '🔧' };

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between ${
                    item.isOverdue
                      ? 'border-rose-300 ring-1 ring-rose-300/40'
                      : item.isUrgent
                      ? 'border-amber-300'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                          {catInfo.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">
                            {item.name}
                          </h3>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span>{item.location}</span>
                            <span aria-hidden="true">·</span>
                            <span>Tous les {item.frequencyDays} jours</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteEquipment(item.id)}
                        title="Supprimer l'appareil"
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3.5 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100">
                      <strong className="text-slate-800 block mb-0.5">Instructions :</strong>
                      {item.instructions}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[11px]">Dernier entretien : {item.lastMaintenanceDate}</span>
                      <div className="font-semibold mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {item.isOverdue ? (
                          <span className="text-rose-600 font-bold">
                            En retard de {Math.abs(item.daysLeft)} jour(s)
                          </span>
                        ) : item.isUrgent ? (
                          <span className="text-amber-600 font-bold">
                            À faire dans {item.daysLeft} jour(s)
                          </span>
                        ) : (
                          <span className="text-emerald-700">
                            Prochain dans {item.daysLeft} jour(s)
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => recordMaintenance(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs active:scale-95 shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Fait aujourd'hui !</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SUB-VIEW 2: SEASONAL CHECKLIST */}
      {activeSubTab === 'seasons' && (
        <div className="space-y-4">
          
          {/* Season Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SEASONS.map(season => {
              const isSelected = activeSeason === season.id;
              const count = seasonalTasks.filter(t => t.season === season.id).length;
              const completedCount = seasonalTasks.filter(t => t.season === season.id && t.completed).length;

              return (
                <button
                  key={season.id}
                  onClick={() => setActiveSeason(season.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                      : 'bg-white/70 border-slate-200 hover:bg-white text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{season.icon}</span>
                    <span className="text-[11px] font-mono text-slate-400">{season.months}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{season.label}</h4>
                  <div className="text-xs text-slate-500 mt-0.5 font-mono tabular-nums">
                    {completedCount} / {count} validées
                  </div>
                </button>
              );
            })}
          </div>

          {/* Seasonal Task Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {filteredSeasonalTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Aucune mission saisonnière enregistrée pour cette saison.
              </div>
            ) : (
              filteredSeasonalTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3.5 p-4 hover:bg-slate-50/80 transition-colors ${
                    task.completed ? 'bg-slate-50/40' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleSeasonalTask(task.id)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-slate-400 hover:text-emerald-600 transition-transform active:scale-90 shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 hover:text-emerald-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-bold ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {task.description}
                    </p>
                    {task.completedAt && (
                      <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                        Accompli le {task.completedAt}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};
