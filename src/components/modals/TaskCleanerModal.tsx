import React, { useState } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { RoomType } from '../../types';
import { X, Trash2, Sparkles, CheckSquare, Square } from 'lucide-react';
import { ROOM_THEMES } from '../views/AgendaView';

interface TaskCleanerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskCleanerModal: React.FC<TaskCleanerModalProps> = ({ isOpen, onClose }) => {
  const {
    tasks,
    deleteTask,
    bulkDeleteTasks,
    clearAllTasks,
    loadMinimalTasks,
  } = useHousehold();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  if (!isOpen) return null;

  const filteredTasks = tasks.filter(t => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.room.toLowerCase().includes(q);
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map(t => t.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    bulkDeleteTasks(selectedIds);
    setSelectedIds([]);
  };

  const handleClearAll = () => {
    clearAllTasks();
    setSelectedIds([]);
    setConfirmClearAll(false);
  };

  const handleLoadMinimal = () => {
    loadMinimalTasks();
    setSelectedIds([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <span>🧹</span>
              <span>Faire du tri dans les tâches</span>
            </h2>
            <p className="text-xs text-slate-500">
              Supprimez les corvées non pertinentes, faites du tri ou repartez d'une base épurée.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Bulk Actions Strip */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 my-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg"
            >
              {selectedIds.length === filteredTasks.length && filteredTasks.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-indigo-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Tout sélectionner ({filteredTasks.length})</span>
            </button>

            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer la sélection ({selectedIds.length})</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadMinimal}
              title="Garder seulement 4 tâches clés"
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-indigo-200/60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>4 corvées clés</span>
            </button>

            {!confirmClearAll ? (
              <button
                onClick={() => setConfirmClearAll(true)}
                className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg font-semibold transition-colors"
              >
                Tout vider
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-50 p-1 rounded-lg border border-rose-200">
                <span className="text-[11px] font-bold text-rose-800">Confirmer ?</span>
                <button
                  onClick={handleClearAll}
                  className="px-2 py-0.5 bg-rose-600 text-white rounded text-[11px] font-bold"
                >
                  Oui, vider
                </button>
                <button
                  onClick={() => setConfirmClearAll(false)}
                  className="px-1.5 py-0.5 text-slate-500 text-[11px]"
                >
                  Non
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-3 shrink-0">
          <input
            type="text"
            placeholder="Rechercher une tâche à trier..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Task List (Scrollable) */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-2xl">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Aucune tâche enregistrée. La liste est entièrement vide !
            </div>
          ) : (
            filteredTasks.map(task => {
              const isChecked = selectedIds.includes(task.id);
              const roomInfo = ROOM_THEMES[task.room] || ROOM_THEMES.toute_la_maison;

              return (
                <div
                  key={task.id}
                  className={`p-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors ${
                    isChecked ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <button
                      onClick={() => toggleSelect(task.id)}
                      className="p-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
                        <span className={`px-1.5 py-0.2 rounded font-bold ${roomInfo.badgeBg} ${roomInfo.badgeText}`}>
                          {roomInfo.icon} {roomInfo.label}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{task.frequency === 'daily' ? 'Quotidien' : 'Hebdo'}</span>
                        {task.isRoutine && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-indigo-600 font-bold">Routine {task.intervalDays}j</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{task.dueDate}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                        {task.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    title="Supprimer cette tâche"
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {tasks.length} tâche{tasks.length > 1 ? 's' : ''} au total
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
          >
            Terminer le tri
          </button>
        </div>

      </div>
    </div>
  );
};
