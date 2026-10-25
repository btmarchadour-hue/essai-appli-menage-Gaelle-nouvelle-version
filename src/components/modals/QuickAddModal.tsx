import React, { useState } from 'react';
import { useHousehold, TODAY_STR } from '../../context/HouseholdContext';
import { 
  RoomType, 
  EquipmentCategory,
  TaskDifficulty,
  TaskFrequency,
  TimeOfDay
} from '../../types';
import { X, Calendar, Wrench, Repeat, AlertCircle, Plus, Check } from 'lucide-react';
import { ROOM_THEMES } from '../views/AgendaView';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'task' | 'equipment';
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'task',
}) => {
  const {
    addTask,
    addEquipment,
    selectedDate,
  } = useHousehold();

  const [activeType, setActiveType] = useState<'task' | 'equipment'>(defaultType);

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskRoom, setTaskRoom] = useState<RoomType>('chambres');
  const [taskDifficulty, setTaskDifficulty] = useState<TaskDifficulty>('facile');
  const [taskFrequency, setTaskFrequency] = useState<TaskFrequency>('custom_days');
  const [taskDueDate, setTaskDueDate] = useState<string>(selectedDate || TODAY_STR);
  const [taskTimeOfDay, setTaskTimeOfDay] = useState<TimeOfDay>('libre');
  const [taskUrgent, setTaskUrgent] = useState(false);

  // Routine recurrence parameters
  const [isRoutine, setIsRoutine] = useState(false);
  const [intervalDays, setIntervalDays] = useState(15); // Default 15 days for bedsheets!

  // Equipment form state
  const [eqName, setEqName] = useState('');
  const [eqCategory, setEqCategory] = useState<EquipmentCategory>('electromenager');
  const [eqLocation, setEqLocation] = useState('');
  const [eqFreqDays, setEqFreqDays] = useState(60);
  const [eqInstructions, setEqInstructions] = useState('');

  // Sync with selectedDate when opened
  React.useEffect(() => {
    if (isOpen) {
      setTaskDueDate(selectedDate || TODAY_STR);
      setActiveType(defaultType);
    }
  }, [isOpen, selectedDate, defaultType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeType === 'task') {
      if (!taskTitle.trim()) return;
      addTask({
        title: taskTitle.trim(),
        description: taskDesc.trim() || undefined,
        room: taskRoom,
        difficulty: taskDifficulty,
        frequency: isRoutine ? 'custom_days' : taskFrequency,
        dueDate: taskDueDate || TODAY_STR,
        timeOfDay: taskTimeOfDay,
        urgent: taskUrgent,
        isRoutine: isRoutine,
        intervalDays: isRoutine ? Number(intervalDays) : undefined,
        lastCompletedDate: isRoutine ? TODAY_STR : undefined,
      });
    } else if (activeType === 'equipment') {
      if (!eqName.trim()) return;
      addEquipment({
        name: eqName.trim(),
        category: eqCategory,
        location: eqLocation.trim() || 'Maison',
        lastMaintenanceDate: TODAY_STR,
        frequencyDays: Number(eqFreqDays) || 60,
        instructions: eqInstructions.trim() || 'Contrôler et nettoyer.',
      });
    }

    // Reset fields
    setTaskTitle('');
    setTaskDesc('');
    setIsRoutine(false);
    onClose();
  };

  const roomKeys: RoomType[] = ['cuisine', 'salon', 'chambres', 'salle_de_bain', 'entree', 'exterieur', 'toute_la_maison'];

  const setRelativeDue = (daysToAdd: number) => {
    const d = new Date(TODAY_STR);
    d.setDate(d.getDate() + daysToAdd);
    setTaskDueDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-amber-200/80 max-h-[92vh] overflow-y-auto animate-fade-in text-stone-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-amber-200/70">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="text-base font-bold text-amber-950 font-display">
              Créer une Nouvelle Tâche
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-3 text-xs">
          
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              Intitulé de la tâche *
            </label>
            <input
              type="text"
              required
              placeholder="Ex : Changer les draps des lits, détartrer la cafetière..."
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/40 focus:outline-none font-semibold text-stone-900"
            />
          </div>

          {/* Routine Recurrence Box */}
          <div className="p-3.5 bg-purple-50/80 rounded-2xl border border-purple-200/80 space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRoutine}
                onChange={e => setIsRoutine(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
                <Repeat className="w-4 h-4 text-purple-600" />
                <span>Routine récurrente automatique (ex : draps tous les 15 jours)</span>
              </div>
            </label>

            {isRoutine && (
              <div className="pt-2 pl-6 space-y-2 border-t border-purple-200/60">
                <label className="text-xs font-semibold text-purple-900 block">
                  Cadence maximale de renouvellement :
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={intervalDays}
                    onChange={e => setIntervalDays(Number(e.target.value))}
                    className="w-16 px-2.5 py-1 text-xs bg-white border border-purple-300 rounded-xl font-mono tabular-nums font-bold text-center text-purple-950"
                  />
                  <span className="text-xs text-purple-900 font-medium">jours entre chaque réalisation</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {[
                    { label: '4j (torchons)', d: 4 },
                    { label: '7j (serviettes)', d: 7 },
                    { label: '15j (draps)', d: 15 },
                    { label: '30j (détartrage)', d: 30 }
                  ].map(preset => (
                    <button
                      key={preset.d}
                      type="button"
                      onClick={() => setIntervalDays(preset.d)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-colors ${
                        intervalDays === preset.d 
                          ? 'bg-purple-700 text-white border-purple-700' 
                          : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded-2xl border border-amber-200/70">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Date d'échéance *</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setRelativeDue(0)}
                    className="text-[10px] text-amber-900 font-semibold hover:underline"
                  >
                    Auj.
                  </button>
                  <span className="text-stone-300">·</span>
                  <button
                    type="button"
                    onClick={() => setRelativeDue(1)}
                    className="text-[10px] text-amber-900 font-semibold hover:underline"
                  >
                    Demain
                  </button>
                </div>
              </div>
              <input
                type="date"
                required
                value={taskDueDate}
                onChange={e => setTaskDueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono tabular-nums font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Créneau horaire
              </label>
              <select
                value={taskTimeOfDay}
                onChange={e => setTaskTimeOfDay(e.target.value as TimeOfDay)}
                className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
              >
                <option value="libre">📋 Sans préférence horaire (Toute la journée)</option>
                <option value="matin">🌅 Matin (07h-09h)</option>
                <option value="apres_midi">☀️ Après-midi (16h-18h)</option>
                <option value="soir">🌙 Soirée (19h-21h)</option>
              </select>
            </div>
          </div>

          {/* Room Selection */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1.5">
              Pièce de la maison *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {roomKeys.map(rk => {
                const isSelected = taskRoom === rk;
                const theme = ROOM_THEMES[rk];
                return (
                  <button
                    key={rk}
                    type="button"
                    onClick={() => setTaskRoom(rk)}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950 text-white border-amber-950 shadow-xs'
                        : `${theme.cardBg} ${theme.cardBorder} text-stone-800 hover:shadow-xs`
                    }`}
                  >
                    <span className="text-base">{theme.icon}</span>
                    <span className="text-[10px] font-bold truncate w-full">{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              Description ou consignes (optionnel)
            </label>
            <input
              type="text"
              placeholder="Ex : Housse de couette, taie d’oreiller, produit vitre..."
              value={taskDesc}
              onChange={e => setTaskDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
            />
          </div>

          {/* Urgent checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={taskUrgent}
                onChange={e => setTaskUrgent(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span className="flex items-center gap-1 text-rose-700 font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Priorité haute / Urgent</span>
              </span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-amber-200/70">
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
              <span>Créer la tâche</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
