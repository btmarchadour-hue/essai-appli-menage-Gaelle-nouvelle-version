import React, { useState, useEffect } from 'react';
import { useHousehold, TODAY_STR } from '../../context/HouseholdContext';
import { ChoreTask, RoomType, TimeOfDay, TaskFrequency, TaskDifficulty } from '../../types';
import { X, Trash2, Calendar, Repeat, Clock, Check, Home, AlertCircle } from 'lucide-react';
import { ROOM_THEMES } from '../views/AgendaView';

interface TaskEditModalProps {
  task: ChoreTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, isOpen, onClose }) => {
  const { editTask, deleteTask } = useHousehold();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [room, setRoom] = useState<RoomType>('cuisine');
  const [dueDate, setDueDate] = useState(TODAY_STR);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('soir');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('facile');
  const [frequency, setFrequency] = useState<TaskFrequency>('daily');
  const [isRoutine, setIsRoutine] = useState(false);
  const [intervalDays, setIntervalDays] = useState(15);
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setRoom(task.room);
      setDueDate(task.dueDate);
      setTimeOfDay(task.timeOfDay || 'libre');
      setDifficulty(task.difficulty || 'facile');
      setFrequency(task.frequency);
      setIsRoutine(!!task.isRoutine);
      setIntervalDays(task.intervalDays || 15);
      setUrgent(!!task.urgent);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

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
    });

    onClose();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  const roomKeys: RoomType[] = ['cuisine', 'salon', 'chambres', 'salle_de_bain', 'entree', 'exterieur', 'toute_la_maison'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <span>✏️</span>
              <span>Modifier la Corvée</span>
            </h2>
            <p className="text-xs text-slate-500">
              Ajustez la pièce, la date d'échéance, le créneau horaire ou la routine.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Intitulé de la tâche *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none font-semibold text-slate-900"
            />
          </div>

          {/* Room Selection with Visual Grid */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Pièce / Zone de la maison</span>
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
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : `${theme.cardBg} ${theme.cardBorder} text-slate-700 hover:shadow-xs`
                    }`}
                  >
                    <span className="text-xl">{theme.icon}</span>
                    <span className="text-[11px] font-bold truncate">{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Date dans l'agenda *</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono tabular-nums font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>Créneau du jour</span>
              </label>
              <select
                value={timeOfDay}
                onChange={e => setTimeOfDay(e.target.value as TimeOfDay)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              >
                <option value="matin">🌅 Matin (07h-09h)</option>
                <option value="apres_midi">☀️ Après-midi (16h-18h)</option>
                <option value="soir">🌙 Soirée (19h-21h)</option>
                <option value="libre">📋 Dans la journée</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Description ou consigne (optionnel)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Conseils, produits à utiliser..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Routine Recurrence Box */}
          <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-200/80 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRoutine}
                onChange={e => setIsRoutine(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                <Repeat className="w-4 h-4 text-indigo-600" />
                <span>Routine récurrente (ex: draps tous les 15 jours)</span>
              </div>
            </label>

            {isRoutine && (
              <div className="pl-6 pt-1 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={intervalDays}
                  onChange={e => setIntervalDays(Number(e.target.value))}
                  className="w-16 px-2.5 py-1 text-xs bg-white border border-indigo-200 rounded-lg font-mono tabular-nums text-center font-bold"
                />
                <span className="text-xs text-indigo-800">jours maxi entre 2 réalisations</span>
              </div>
            )}
          </div>

          {/* Urgent checkbox */}
          <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-50 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={urgent}
              onChange={e => setUrgent(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded"
            />
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Marquer comme prioritaire / urgent</span>
            </span>
          </label>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1.5 hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer la tâche</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
