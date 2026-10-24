import React, { useState } from 'react';
import { useHousehold, TODAY_STR } from '../../context/HouseholdContext';
import { ChoreTask, RoomType } from '../../types';
import { 
  Repeat, 
  Sparkles, 
  Plus, 
  Clock, 
  Check, 
  Trash2, 
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { ROOM_THEMES } from './AgendaView';

interface RoutinesViewProps {
  onOpenCreateRoutine: () => void;
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({ onOpenCreateRoutine }) => {
  const {
    tasks,
    renewRoutine,
    deleteTask,
    addTask,
  } = useHousehold();

  const [routineNotice, setRoutineNotice] = useState<string | null>(null);

  // Filter only recurring routine tasks
  const routineTasks = tasks.filter(t => t.isRoutine && t.intervalDays);

  const handleRenew = (task: ChoreTask) => {
    renewRoutine(task.id);
    setRoutineNotice(`« ${task.title} » est validé pour aujourd'hui et reprogrammé dans ${task.intervalDays} jours.`);
    setTimeout(() => setRoutineNotice(null), 4500);
  };

  const addPresetRoutine = (title: string, room: RoomType, intervalDays: number, desc: string) => {
    addTask({
      title,
      description: desc,
      room,
      frequency: 'custom_days',
      difficulty: 'facile',
      dueDate: TODAY_STR,
      timeOfDay: 'matin',
      isRoutine: true,
      intervalDays,
      lastCompletedDate: TODAY_STR,
    });
    setRoutineNotice(`Routine « ${title} » ajoutée avec succès (tous les ${intervalDays} jours) !`);
    setTimeout(() => setRoutineNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 rounded-3xl p-6 text-white shadow-md shadow-orange-950/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Repeat className="w-6 h-6 text-amber-200" />
              <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight">
                Routines & Cadences Récurrentes du Foyer
              </h1>
            </div>
            <p className="text-amber-100 text-sm max-w-2xl">
              Automatisez les cycles réguliers de la maison : draps tous les 15 jours maxi, serviettes de bain, détartrage et grand ménage.
            </p>
          </div>

          <button
            onClick={onOpenCreateRoutine}
            className="flex items-center gap-2 px-4 py-2 bg-white text-stone-900 hover:bg-amber-50 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Créer une Routine</span>
          </button>
        </div>

        {/* Dynamic Notice Banner */}
        {routineNotice && (
          <div className="mt-4 p-3 bg-white/20 backdrop-blur-md rounded-xl text-xs font-medium text-white flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>{routineNotice}</span>
          </div>
        )}

        {/* Routine Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/20 text-white">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-xs text-amber-100 block">Routines actives</span>
            <span className="text-2xl font-bold font-mono tabular-nums">{routineTasks.length}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-xs text-amber-100 block">Cadence personnalisée</span>
            <span className="text-sm font-semibold mt-1 block">Tous les 4 à 30 jours</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs col-span-2 sm:col-span-1">
            <span className="text-xs text-amber-100 block">Renouvellement</span>
            <span className="text-sm font-semibold mt-1 block">1 clic = reprogrammé</span>
          </div>
        </div>
      </div>

      {/* Routine Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
            <span>Routines en cours</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200/70">
              {routineTasks.length}
            </span>
          </h2>
          <span className="text-xs text-stone-500">
            Dès que vous cochez une routine, la prochaine date est calculée automatiquement.
          </span>
        </div>

        {routineTasks.length === 0 ? (
          <div className="bg-[#FFFDF9] rounded-3xl p-12 text-center border border-amber-200/80 shadow-xs">
            <span className="text-4xl block mb-2">🔄</span>
            <h3 className="text-base font-bold text-stone-800">Aucune routine configurée</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Les routines vous évitent d'oublier les tâches périodiques comme les draps, le détartrage ou le changement des filtres.
            </p>
            <button
              onClick={onOpenCreateRoutine}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Créer ma première routine</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routineTasks.map(routine => {
              const theme = ROOM_THEMES[routine.room] || ROOM_THEMES.toute_la_maison;
              const interval = routine.intervalDays || 15;
              
              // Calculate progress: days since last completed or since due date
              const today = new Date(TODAY_STR);
              const due = new Date(routine.dueDate);
              const diffMs = due.getTime() - today.getTime();
              const daysLeft = Math.ceil(diffMs / (1000 * 3600 * 24));
              
              const isOverdue = daysLeft < 0;
              const isSoon = daysLeft >= 0 && daysLeft <= 2;
              const daysElapsed = Math.max(0, interval - daysLeft);
              const progressPct = Math.min(100, Math.max(0, Math.round((daysElapsed / interval) * 100)));

              return (
                <div
                  key={routine.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${theme.barColor}`} />

                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${theme.badgeBg} ${theme.badgeText}`}>
                            <span>{theme.icon}</span>
                            <span>{theme.label}</span>
                          </span>

                          <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-md">
                            Tous les {interval} jours
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {routine.title}
                        </h3>

                        {routine.description && (
                          <p className="text-xs text-slate-500 mt-1">
                            {routine.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => deleteTask(routine.id)}
                        title="Supprimer la routine"
                        className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Freshness / Progress Gauge */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Dernier renouvellement : <strong className="text-slate-700">{routine.lastCompletedDate || 'Non renseigné'}</strong>
                        </span>
                        <span className="font-mono tabular-nums font-bold text-slate-800">
                          {daysElapsed} / {interval} jours
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${progressPct}%` }}
                          className={`h-full transition-all ${
                            isOverdue
                              ? 'bg-rose-500'
                              : isSoon
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                      </div>

                      {/* Status Text */}
                      <div className="text-[11px] font-semibold flex items-center justify-between">
                        {isOverdue ? (
                          <span className="text-rose-600 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Dépassé de {Math.abs(daysLeft)} jour(s) ! À renouveler dès aujourd'hui.</span>
                          </span>
                        ) : isSoon ? (
                          <span className="text-amber-700 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>À faire dans {daysLeft} jour(s) maxi.</span>
                          </span>
                        ) : (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Frais & propre (prochain dans {daysLeft} jours).</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-400 font-mono">
                      Prochaine : {routine.dueDate}
                    </span>

                    {/* Primary Renewal Button */}
                    <button
                      onClick={() => handleRenew(routine)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>Fait aujourd'hui ! (Repartir pour {interval}j)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Routine Suggestions & Presets */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
          Idées de routines recommandées pour votre foyer
        </h3>
        <p className="text-xs text-slate-500">
          Ajoutez en 1 clic une routine classique avec la cadence idéale :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          <button
            onClick={() => addPresetRoutine('Changer draps lit parental', 'chambres', 15, 'Housse de couette et taies d’oreillers (tous les 15 jours).')}
            className="p-3 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🛏️</span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded">15 jours</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-1">Draps lit parental</h4>
            <span className="text-[11px] text-slate-500">Chambres · 15 jours</span>
          </button>

          <button
            onClick={() => addPresetRoutine('Draps lit Marie', 'chambres', 15, 'Housse 1 place, drap et taie (tous les 15 jours).')}
            className="p-3 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🛏️</span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded">15 jours</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-1">Draps lit Marie</h4>
            <span className="text-[11px] text-slate-500">Chambres · 15 jours</span>
          </button>

          <button
            onClick={() => addPresetRoutine('Draps lit Louise', 'chambres', 15, 'Housse 1 place, drap et taie (tous les 15 jours).')}
            className="p-3 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🛏️</span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded">15 jours</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-1">Draps lit Louise</h4>
            <span className="text-[11px] text-slate-500">Chambres · 15 jours</span>
          </button>

          <button
            onClick={() => addPresetRoutine('Lavage de sol RDC', 'salon', 7, 'Aspirateur et serpillière au RDC (tous les 7 jours).')}
            className="p-3 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🧹</span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded">7 jours</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-1">Lavage sol RDC</h4>
            <span className="text-[11px] text-slate-500">Salon / RDC · 7 jours</span>
          </button>

          <button
            onClick={() => addPresetRoutine('Lavage du sol étage', 'chambres', 7, 'Aspirateur et serpillière à l’étage (tous les 7 jours).')}
            className="p-3 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🧹</span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded">7 jours</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-1">Lavage sol étage</h4>
            <span className="text-[11px] text-slate-500">Étage · 7 jours</span>
          </button>

          <button
            onClick={() => addPresetRoutine('Détartrage cafetière', 'cuisine', 30, 'Cycle détartrage et rinçages (tous les 30 jours).')}
            className="p-3 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">☕</span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded">30 jours</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-1">Détartrage cafetière</h4>
            <span className="text-[11px] text-slate-500">Cuisine · 30 jours</span>
          </button>

          <button
            onClick={() => addPresetRoutine('Nettoyage du four', 'cuisine', 90, 'Dégraissage parois, vitres et grilles (tous les 3 mois).')}
            className="p-3 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🔥</span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded">3 mois</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-1">Nettoyage du four</h4>
            <span className="text-[11px] text-slate-500">Cuisine · 90 jours</span>
          </button>

          <button
            onClick={() => addPresetRoutine('Shampoinnage tapis et canapé', 'salon', 180, 'Injection-extraction textile (tous les 6 mois).')}
            className="p-3 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🛋️</span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded">6 mois</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-1">Tapis & Canapé</h4>
            <span className="text-[11px] text-slate-500">Salon · 180 jours</span>
          </button>
        </div>
      </div>

    </div>
  );
};
