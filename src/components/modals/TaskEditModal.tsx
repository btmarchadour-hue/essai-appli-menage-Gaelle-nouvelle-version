import React, { useState, useEffect } from 'react';
import { useHousehold, TODAY_STR } from '../../context/HouseholdContext';
import { ChoreTask, RoomType, TimeOfDay, TaskFrequency, TaskDifficulty } from '../../types';
import { 
  X, 
  Trash2, 
  Calendar, 
  Repeat, 
  Clock, 
  Check, 
  Home, 
  AlertCircle, 
  CheckCircle2, 
  Circle,
  Sparkles,
  Layers,
  FileText,
  CalendarCheck2
} from 'lucide-react';
import { ROOM_THEMES } from '../views/AgendaView';

interface TaskEditModalProps {
  task: ChoreTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, isOpen, onClose }) => {
  const { editTask, deleteTask, duplicateTask, triggerCongratulations } = useHousehold();

  // All Task Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [room, setRoom] = useState<RoomType>('cuisine');
  const [dueDate, setDueDate] = useState(TODAY_STR);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('libre');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('facile');
  const [frequency, setFrequency] = useState<TaskFrequency>('custom_days');
  const [isRoutine, setIsRoutine] = useState(false);
  const [intervalDays, setIntervalDays] = useState(15);
  const [lastCompletedDate, setLastCompletedDate] = useState<string>('');
  const [completed, setCompleted] = useState(false);
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setRoom(task.room);
      setDueDate(task.dueDate);
      setTimeOfDay(task.timeOfDay || 'libre');
      setDifficulty(task.difficulty || 'facile');
      setFrequency(task.frequency || 'custom_days');
      setIsRoutine(!!task.isRoutine);
      setIntervalDays(task.intervalDays || 15);
      setLastCompletedDate(task.lastCompletedDate || '');
      setCompleted(task.completed);
      setUrgent(!!task.urgent);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Trigger celebration if newly completed via modal
    if (!task.completed && completed) {
      triggerCongratulations(title.trim());
    }

    editTask({
      ...task,
      title: title.trim(),
      description: description.trim() || undefined,
      room,
      dueDate,
      timeOfDay,
      difficulty,
      frequency: isRoutine ? 'custom_days' : frequency,
      urgent,
      isRoutine,
      intervalDays: isRoutine ? Number(intervalDays) : undefined,
      lastCompletedDate: isRoutine && lastCompletedDate ? lastCompletedDate : (completed ? TODAY_STR : task.lastCompletedDate),
      completed,
      completedAt: completed ? (task.completedAt || new Date().toISOString()) : undefined,
    });

    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Supprimer définitivement la tâche "${task.title}" ?`)) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handleDuplicate = () => {
    duplicateTask(task.id);
    onClose();
  };

  const setRelativeDue = (daysToAdd: number) => {
    const d = new Date(TODAY_STR);
    d.setDate(d.getDate() + daysToAdd);
    setDueDate(d.toISOString().split('T')[0]);
  };

  const roomKeys: RoomType[] = [
    'cuisine', 
    'salon', 
    'chambres', 
    'salle_de_bain', 
    'entree', 
    'exterieur', 
    'toute_la_maison'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-amber-200/80 max-h-[92vh] overflow-y-auto animate-fade-in text-stone-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-200/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300/80 flex items-center justify-center text-xl shrink-0">
              ✏️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-950 font-display flex items-center gap-1.5">
                <span>Modifier toutes les informations</span>
              </h2>
              <p className="text-xs text-stone-500">
                Ajustez chaque paramètre de cette corvée ou routine du foyer.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4 text-xs">
          
          {/* 1. Title */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              Intitulé de la tâche *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Changer les draps lit parental..."
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/40 focus:outline-none font-bold text-stone-900 shadow-2xs"
            />
          </div>

          {/* 2. Room Selection with Visual Grid */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1.5 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-amber-700" />
              <span>Pièce / Espace de la maison *</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roomKeys.map(rk => {
                const isSelected = room === rk;
                const theme = ROOM_THEMES[rk];
                return (
                  <button
                    key={rk}
                    type="button"
                    onClick={() => setRoom(rk)}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950 text-white border-amber-950 shadow-xs'
                        : `${theme.cardBg} ${theme.cardBorder} text-stone-800 hover:shadow-xs`
                    }`}
                  >
                    <span className="text-xl">{theme.icon}</span>
                    <span className="text-[11px] font-bold truncate w-full">{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Due Date & Quick presets */}
          <div className="p-3 bg-white rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Date d'échéance dans le planning *</span>
              </label>

              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] text-stone-400 mr-1">Raccourcis :</span>
                <button
                  type="button"
                  onClick={() => setRelativeDue(0)}
                  className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-[10px] font-bold text-stone-700"
                >
                  Aujourd'hui
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDue(1)}
                  className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-[10px] font-bold text-stone-700"
                >
                  Demain
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDue(7)}
                  className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-[10px] font-bold text-stone-700"
                >
                  +7j
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDue(15)}
                  className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-[10px] font-bold text-stone-700"
                >
                  +15j
                </button>
              </div>
            </div>

            <input
              type="date"
              required
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono tabular-nums font-bold text-stone-900"
            />
          </div>

          {/* 4. Time Slot & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-2xl border border-stone-200">
              <label className="text-xs font-bold text-stone-800 block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>Créneau du jour</span>
              </label>
              <select
                value={timeOfDay}
                onChange={e => setTimeOfDay(e.target.value as TimeOfDay)}
                className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium"
              >
                <option value="libre">📋 Sans préférence horaire (Toute la journée)</option>
                <option value="matin">🌅 Matin (07h-09h)</option>
                <option value="apres_midi">☀️ Après-midi (16h-18h)</option>
                <option value="soir">🌙 Soirée (19h-21h)</option>
              </select>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-stone-200">
              <label className="text-xs font-bold text-stone-800 block mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>Niveau d'effort / Difficulté</span>
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as TaskDifficulty)}
                className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium"
              >
                <option value="facile">🟢 Facile (rapide)</option>
                <option value="moyen">🟡 Moyen (habituel)</option>
                <option value="costaud">🔴 Costaud (grand nettoyage)</option>
              </select>
            </div>
          </div>

          {/* 5. Routine Recurrence Box (Cycles & Cadence) */}
          <div className="p-3.5 bg-purple-50/80 rounded-2xl border border-purple-200/80 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRoutine}
                onChange={e => setIsRoutine(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
                <Repeat className="w-4 h-4 text-purple-600" />
                <span>Routine récurrente automatique (ex: draps tous les 15j)</span>
              </div>
            </label>

            {isRoutine && (
              <div className="pl-6 pt-1 space-y-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-purple-900 font-semibold">Répéter tous les :</span>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={intervalDays}
                    onChange={e => setIntervalDays(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs bg-white border border-purple-300 rounded-lg font-mono tabular-nums text-center font-bold text-purple-950"
                  />
                  <span className="text-xs text-purple-900 font-semibold">jours</span>

                  {/* Preset Cadence Chips */}
                  <div className="flex items-center gap-1 ml-auto">
                    {[7, 15, 30, 60, 90].map(days => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setIntervalDays(days)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors ${
                          intervalDays === days
                            ? 'bg-purple-700 text-white'
                            : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-100'
                        }`}
                      >
                        {days}j
                      </button>
                    ))}
                  </div>
                </div>

                {/* Last Completed Date field */}
                <div className="pt-1 flex items-center gap-2 text-xs">
                  <CalendarCheck2 className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                  <span className="text-purple-950 font-medium shrink-0">Dernière réalisation :</span>
                  <input
                    type="date"
                    value={lastCompletedDate}
                    onChange={e => setLastCompletedDate(e.target.value)}
                    className="px-2 py-1 bg-white border border-purple-200 rounded-lg font-mono text-purple-950 font-semibold text-xs"
                  />
                  {lastCompletedDate && (
                    <button
                      type="button"
                      onClick={() => setLastCompletedDate('')}
                      className="text-[10px] text-purple-600 hover:underline"
                    >
                      Effacer
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 6. Description & Instructions */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              <span>Consignes, conseils ou produits recommandés (optionnel)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ex: Utiliser du vinaigre blanc et microfibre, laver à 60°C..."
              className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
            />
          </div>

          {/* 7. Status & Urgency Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            
            {/* Completed Toggle */}
            <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
              completed
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                : 'bg-white border-stone-200 text-stone-700'
            }`}>
              <input
                type="checkbox"
                checked={completed}
                onChange={e => setCompleted(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <div className="flex items-center gap-1.5 text-xs">
                {completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-400" />
                )}
                <span>Statut : {completed ? '✅ Corvée validée (Faite)' : '⏳ À faire'}</span>
              </div>
            </label>

            {/* Urgent Toggle */}
            <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
              urgent
                ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                : 'bg-white border-stone-200 text-stone-700'
            }`}>
              <input
                type="checkbox"
                checked={urgent}
                onChange={e => setUrgent(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <div className="flex items-center gap-1.5 text-xs">
                <AlertCircle className={`w-4 h-4 ${urgent ? 'text-rose-600' : 'text-stone-400'}`} />
                <span>Marquer comme prioritaire / urgent</span>
              </div>
            </label>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-amber-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>

              <button
                type="button"
                onClick={handleDuplicate}
                className="text-xs text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Dupliquer</span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 rounded-xl shadow-sm shadow-orange-500/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
