import React, { useState } from 'react';
import { useHousehold, TODAY_STR } from '../../context/HouseholdContext';
import { 
  RoomType, 
  EquipmentCategory,
  TaskDifficulty,
  TaskFrequency,
  TimeOfDay
} from '../../types';
import { X, Calendar, Wrench, Repeat, AlertCircle } from 'lucide-react';
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
  const [taskTimeOfDay, setTaskTimeOfDay] = useState<TimeOfDay>('matin');
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

    onClose();
  };

  const roomKeys: RoomType[] = ['cuisine', 'salon', 'chambres', 'salle_de_bain', 'entree', 'exterieur', 'toute_la_maison'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 font-display">
            Planifier dans l'Agenda
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl my-4">
          <button
            type="button"
            onClick={() => setActiveType('task')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeType === 'task'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Tâche ou Routine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('equipment')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeType === 'equipment'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4 text-teal-600" />
            <span>Équipement Maison</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeType === 'task' && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Intitulé de la tâche *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Changer les draps des lits, vider le lave-vaisselle..."
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* Routine Recurrence Box */}
              <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-200/80 space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRoutine}
                    onChange={e => setIsRoutine(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                    <Repeat className="w-4 h-4 text-indigo-600" />
                    <span>Créer une Routine Récurrente (ex : draps tous les 15 jours)</span>
                  </div>
                </label>

                {isRoutine && (
                  <div className="pt-2 pl-6 space-y-2 border-t border-indigo-100">
                    <label className="text-xs font-semibold text-indigo-900 block">
                      Cadence maximale de renouvellement :
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={intervalDays}
                        onChange={e => setIntervalDays(Number(e.target.value))}
                        className="w-20 px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-xl font-mono tabular-nums font-bold text-center"
                      />
                      <span className="text-xs text-indigo-800 font-medium">jours maxi entre 2 réalisations</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <button
                        type="button"
                        onClick={() => setIntervalDays(4)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          intervalDays === 4 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-700 border-indigo-200'
                        }`}
                      >
                        4 jours (torchons)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIntervalDays(7)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          intervalDays === 7 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-700 border-indigo-200'
                        }`}
                      >
                        7 jours (serviettes)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIntervalDays(15)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          intervalDays === 15 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-700 border-indigo-200'
                        }`}
                      >
                        15 jours (draps de lits)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIntervalDays(30)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          intervalDays === 30 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-700 border-indigo-200'
                        }`}
                      >
                        30 jours (détartrage)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Date dans l'agenda *
                  </label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Créneau
                  </label>
                  <select
                    value={taskTimeOfDay}
                    onChange={e => setTaskTimeOfDay(e.target.value as TimeOfDay)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
                  >
                    <option value="matin">🌅 Matin (07h-09h)</option>
                    <option value="apres_midi">☀️ Après-midi (16h-18h)</option>
                    <option value="soir">🌙 Soirée (19h-21h)</option>
                    <option value="libre">📋 Dans la journée</option>
                  </select>
                </div>
              </div>

              {/* Room Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Pièce de la maison
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
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-0.5 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : `${theme.cardBg} ${theme.cardBorder} text-slate-700 hover:shadow-xs`
                        }`}
                      >
                        <span className="text-lg">{theme.icon}</span>
                        <span className="text-[10px] font-bold truncate">{theme.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description ou conseils (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Housse de couette, taie d’oreiller, produit vitre..."
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={taskUrgent}
                    onChange={e => setTaskUrgent(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="flex items-center gap-1 text-rose-700">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Priorité haute / Urgent</span>
                  </span>
                </label>
              </div>
            </>
          )}

          {activeType === 'equipment' && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nom de l'appareil ou équipement *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Chaudière gaz, Lave-linge, VMC..."
                  value={eqName}
                  onChange={e => setEqName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Catégorie
                  </label>
                  <select
                    value={eqCategory}
                    onChange={e => setEqCategory(e.target.value as EquipmentCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="electromenager">Électroménager</option>
                    <option value="chauffage">Chauffage & VMC</option>
                    <option value="plomberie">Plomberie</option>
                    <option value="jardin">Jardin & Extérieur</option>
                    <option value="vehicule">Véhicule</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Localisation
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Cuisine, Garage..."
                    value={eqLocation}
                    onChange={e => setEqLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Fréquence d'entretien (en jours)
                </label>
                <input
                  type="number"
                  min="7"
                  max="730"
                  value={eqFreqDays}
                  onChange={e => setEqFreqDays(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Instructions ou gestes d'entretien
                </label>
                <textarea
                  rows={3}
                  placeholder="Que faut-il vérifier, nettoyer ou remplacer ?"
                  value={eqInstructions}
                  onChange={e => setEqInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
            >
              Enregistrer
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
