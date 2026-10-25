import React, { useState, useMemo } from 'react';
import { useHousehold, TODAY_STR } from '../../context/HouseholdContext';
import { ChoreTask, RoomType, TimeOfDay, TaskDifficulty } from '../../types';
import { ROOM_THEMES } from './AgendaView';
import { TaskEditModal } from '../modals/TaskEditModal';
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Repeat, 
  Calendar, 
  Clock, 
  Trash2, 
  Copy, 
  Edit3, 
  AlertCircle, 
  CheckSquare, 
  Square, 
  ArrowUpDown, 
  ChevronRight,
  Sun,
  Sunrise,
  Sunset,
  Layers,
  Sparkles,
  Check,
  CalendarDays
} from 'lucide-react';

interface TasksManagerViewProps {
  onOpenCreateTask: () => void;
}

type FilterType = 'all' | 'routines_only' | 'standard_only';
type FilterStatus = 'all' | 'pending' | 'completed';
type FilterPriority = 'all' | 'urgent_only';
type SortField = 'dueDate_asc' | 'dueDate_desc' | 'room' | 'title' | 'interval';

export const TasksManagerView: React.FC<TasksManagerViewProps> = ({ onOpenCreateTask }) => {
  const { 
    tasks, 
    toggleTask, 
    deleteTask, 
    duplicateTask, 
    bulkDeleteTasks, 
    postponeTask, 
    renewRoutine,
    editTask 
  } = useHousehold();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<RoomType | 'all'>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [sortField, setSortField] = useState<SortField>('dueDate_asc');

  // Selected task for full editing modal
  const [taskToEdit, setTaskToEdit] = useState<ChoreTask | null>(null);

  // Bulk selection state
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);

  // Inline expanded cards for quick field editing without modal
  const [inlineExpandedId, setInlineExpandedId] = useState<string | null>(null);

  // Stats calculation
  const totalCount = tasks.length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const routineCount = tasks.filter(t => t.isRoutine).length;
  const urgentCount = tasks.filter(t => t.urgent && !t.completed).length;

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Text search (title, description, room)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        ROOM_THEMES[t.room]?.label.toLowerCase().includes(q)
      );
    }

    // Room filter
    if (selectedRoom !== 'all') {
      result = result.filter(t => t.room === selectedRoom);
    }

    // Type filter
    if (filterType === 'routines_only') {
      result = result.filter(t => t.isRoutine);
    } else if (filterType === 'standard_only') {
      result = result.filter(t => !t.isRoutine);
    }

    // Status filter
    if (filterStatus === 'pending') {
      result = result.filter(t => !t.completed);
    } else if (filterStatus === 'completed') {
      result = result.filter(t => t.completed);
    }

    // Priority filter
    if (filterPriority === 'urgent_only') {
      result = result.filter(t => t.urgent);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortField) {
        case 'dueDate_asc':
          return a.dueDate.localeCompare(b.dueDate);
        case 'dueDate_desc':
          return b.dueDate.localeCompare(a.dueDate);
        case 'room':
          return a.room.localeCompare(b.room);
        case 'title':
          return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' });
        case 'interval':
          return (a.intervalDays || 999) - (b.intervalDays || 999);
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, searchQuery, selectedRoom, filterType, filterStatus, filterPriority, sortField]);

  // Bulk actions handlers
  const handleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map(t => t.id));
    }
  };

  const handleToggleSelectTask = (id: string) => {
    setSelectedTaskIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkComplete = () => {
    selectedTaskIds.forEach(id => {
      const t = tasks.find(x => x.id === id);
      if (t && !t.completed) {
        toggleTask(id);
      }
    });
    setSelectedTaskIds([]);
  };

  const handleBulkPostpone = (days: number) => {
    selectedTaskIds.forEach(id => {
      postponeTask(id, days);
    });
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Supprimer définitivement les ${selectedTaskIds.length} tâches sélectionnées ?`)) {
      bulkDeleteTasks(selectedTaskIds);
      setSelectedTaskIds([]);
    }
  };

  // Helper for relative date label
  const getRelativeDateInfo = (dueDateStr: string) => {
    const today = new Date(TODAY_STR);
    const due = new Date(dueDateStr);
    const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) {
      return { text: "Aujourd'hui", color: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' };
    } else if (diffDays === 1) {
      return { text: 'Demain', color: 'bg-orange-100 text-orange-900 border-orange-300' };
    } else if (diffDays === -1) {
      return { text: 'Hier (retard)', color: 'bg-rose-100 text-rose-900 border-rose-300 font-bold' };
    } else if (diffDays < -1) {
      return { text: `Retard de ${Math.abs(diffDays)} j`, color: 'bg-rose-100 text-rose-900 border-rose-300 font-bold' };
    } else if (diffDays <= 7) {
      return { text: `Dans ${diffDays} j`, color: 'bg-amber-50 text-stone-700 border-amber-200' };
    } else {
      return { text: dueDateStr, color: 'bg-stone-100 text-stone-600 border-stone-200' };
    }
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
    <div className="space-y-6">
      
      {/* Top Banner / Welcome to Tasks Manager */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-sm shadow-amber-900/5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl">📋</span>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-amber-950 tracking-tight">
                Gestionnaire de Tâches & Corvées
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Modification totale
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Retrouvez l'ensemble des corvées du foyer (ponctuelles et routines cycliques). Vous pouvez consulter et <strong>modifier toutes les informations</strong> (intitulé, pièce, échéance, heure, répétition en jours, consigne, urgence).
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsBulkMode(!isBulkMode)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                isBulkMode
                  ? 'bg-amber-950 text-white border-amber-950'
                  : 'bg-amber-50 text-stone-700 border-amber-200/80 hover:bg-amber-100'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{isBulkMode ? 'Quitter sélection' : 'Sélection multiple'}</span>
            </button>

            <button
              onClick={onOpenCreateTask}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 rounded-xl shadow-sm shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Nouvelle tâche</span>
            </button>
          </div>
        </div>

        {/* Quick summary stats chips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5 pt-4 border-t border-amber-100">
          <button
            onClick={() => { setFilterStatus('all'); setFilterType('all'); }}
            className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-left hover:bg-amber-100/60 transition-colors"
          >
            <span className="text-[10px] font-bold text-stone-500 block uppercase tracking-wider">Total</span>
            <span className="text-lg font-black font-display text-amber-950">{totalCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('pending')}
            className="p-2.5 rounded-2xl bg-orange-50/80 border border-orange-200/70 text-left hover:bg-orange-100/70 transition-colors"
          >
            <span className="text-[10px] font-bold text-orange-800 block uppercase tracking-wider">À faire</span>
            <span className="text-lg font-black font-display text-orange-950">{pendingCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('completed')}
            className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-left hover:bg-emerald-100/70 transition-colors"
          >
            <span className="text-[10px] font-bold text-emerald-800 block uppercase tracking-wider">Terminées</span>
            <span className="text-lg font-black font-display text-emerald-950">{completedCount}</span>
          </button>

          <button
            onClick={() => setFilterType('routines_only')}
            className="p-2.5 rounded-2xl bg-purple-50/80 border border-purple-200/70 text-left hover:bg-purple-100/70 transition-colors"
          >
            <span className="text-[10px] font-bold text-purple-800 block uppercase tracking-wider">Routines (draps...)</span>
            <span className="text-lg font-black font-display text-purple-950">{routineCount}</span>
          </button>

          <button
            onClick={() => setFilterPriority('urgent_only')}
            className="p-2.5 rounded-2xl bg-rose-50/80 border border-rose-200/70 text-left hover:bg-rose-100/70 transition-colors col-span-2 sm:col-span-1"
          >
            <span className="text-[10px] font-bold text-rose-800 block uppercase tracking-wider">Urgentes</span>
            <span className="text-lg font-black font-display text-rose-950">{urgentCount}</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Room Pills, Filters & Sorting */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-amber-200/80 p-4 space-y-3.5 shadow-xs">
        
        {/* Row 1: Search bar + Sorting */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher une tâche, pièce, consigne, produit..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:outline-none transition-all placeholder:text-stone-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs text-stone-500 font-medium">Trier par :</span>
            <select
              value={sortField}
              onChange={e => setSortField(e.target.value as SortField)}
              className="px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-xl font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
            >
              <option value="dueDate_asc">Date d'échéance (plus proche)</option>
              <option value="dueDate_desc">Date d'échéance (plus lointaine)</option>
              <option value="room">Pièce de la maison</option>
              <option value="title">Titre alphabétique (A → Z)</option>
              <option value="interval">Cycle de routine (en jours)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Room Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedRoom('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              selectedRoom === 'all'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <span>🏡</span>
            <span>Toutes les pièces</span>
            <span className="text-[10px] opacity-80">({tasks.length})</span>
          </button>

          {roomKeys.map(rk => {
            const count = tasks.filter(t => t.room === rk).length;
            const theme = ROOM_THEMES[rk];
            const isSelected = selectedRoom === rk;
            return (
              <button
                key={rk}
                onClick={() => setSelectedRoom(rk)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                  isSelected
                    ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                    : `${theme.cardBg} ${theme.cardBorder} text-stone-800 hover:shadow-xs`
                }`}
              >
                <span>{theme.icon}</span>
                <span>{theme.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white/80 text-stone-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 3: Secondary filters (Type, Status, Urgency) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-100/70 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-stone-400 font-medium">Afficher :</span>
            
            {/* Type selector */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as FilterType)}
              className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg font-medium text-stone-700 cursor-pointer"
            >
              <option value="all">Tous les types (Routines & Ponctuelles)</option>
              <option value="routines_only">🔄 Routines cycliques uniquement (ex: draps)</option>
              <option value="standard_only">📌 Tâches ponctuelles uniquement</option>
            </select>

            {/* Status selector */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as FilterStatus)}
              className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg font-medium text-stone-700 cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">⏳ À faire seulement</option>
              <option value="completed">✅ Terminées seulement</option>
            </select>

            {/* Priority toggle */}
            <button
              onClick={() => setFilterPriority(prev => prev === 'all' ? 'urgent_only' : 'all')}
              className={`px-2.5 py-1 rounded-lg border font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                filterPriority === 'urgent_only'
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <AlertCircle className="w-3 h-3 text-rose-500" />
              <span>Urgentes uniquement</span>
            </button>
          </div>

          <div className="text-stone-500 font-medium">
            <strong>{filteredTasks.length}</strong> tâche(s) affichée(s)
          </div>
        </div>

      </div>

      {/* Bulk Action Bar (visible when selection mode is active) */}
      {isBulkMode && (
        <div className="sticky top-20 z-30 bg-amber-950 text-white rounded-2xl p-3.5 shadow-xl flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-xs font-bold hover:text-amber-200 cursor-pointer"
            >
              {selectedTaskIds.length === filteredTasks.length ? (
                <CheckSquare className="w-4 h-4 text-amber-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>
                {selectedTaskIds.length === filteredTasks.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </span>
            </button>
            <span className="text-xs text-amber-300 font-bold">
              ({selectedTaskIds.length} sélectionnée(s))
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleBulkComplete}
              disabled={selectedTaskIds.length === 0}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Valider la sélection</span>
            </button>

            <button
              onClick={() => handleBulkPostpone(1)}
              disabled={selectedTaskIds.length === 0}
              className="px-3 py-1.5 text-xs font-bold bg-amber-800 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer"
            >
              <span>+1j</span>
            </button>

            <button
              onClick={() => handleBulkPostpone(7)}
              disabled={selectedTaskIds.length === 0}
              className="px-3 py-1.5 text-xs font-bold bg-amber-800 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer"
            >
              <span>+7j</span>
            </button>

            <button
              onClick={handleBulkDelete}
              disabled={selectedTaskIds.length === 0}
              className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-[#FFFDF9] rounded-3xl border border-dashed border-amber-300 p-12 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-3xl">
            🧹
          </div>
          <h3 className="text-base font-bold text-amber-950 font-display">
            Aucune tâche ne correspond à vos filtres
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Essayez de modifier votre recherche ou vos filtres de pièces pour afficher vos corvées.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRoom('all');
              setFilterType('all');
              setFilterStatus('all');
              setFilterPriority('all');
            }}
            className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => {
            const roomTheme = ROOM_THEMES[task.room] || ROOM_THEMES.cuisine;
            const dateInfo = getRelativeDateInfo(task.dueDate);
            const isSelected = selectedTaskIds.includes(task.id);
            const isInlineExpanded = inlineExpandedId === task.id;

            return (
              <div
                key={task.id}
                className={`group rounded-2xl border transition-all duration-150 ${
                  task.completed
                    ? 'bg-stone-50/80 border-stone-200/80 opacity-80'
                    : `${roomTheme.cardBg} ${roomTheme.cardBorder} shadow-2xs hover:shadow-md`
                } ${isSelected ? 'ring-2 ring-amber-500 border-amber-500' : ''}`}
              >
                {/* Main Card Header / Summary Row */}
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left: Selection/Check + Room + Title + Badges */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    
                    {/* Checkbox or Bulk select */}
                    {isBulkMode ? (
                      <button
                        onClick={() => handleToggleSelectTask(task.id)}
                        className="mt-0.5 text-stone-400 hover:text-amber-800 cursor-pointer shrink-0"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-amber-700" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleTask(task.id)}
                        title={task.completed ? 'Marquer comme non fait' : 'Valider la tâche (célébration Chuck Norris !)'}
                        className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-400 hover:text-stone-700" />
                        )}
                      </button>
                    )}

                    {/* Room Icon & Title & Badges */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        
                        {/* Room Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 ${roomTheme.badgeBg} ${roomTheme.badgeText}`}>
                          <span>{roomTheme.icon}</span>
                          <span>{roomTheme.label}</span>
                        </span>

                        {/* Relative Due Date badge */}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 font-mono ${dateInfo.color}`}>
                          📅 {dateInfo.text}
                        </span>

                        {/* Time of Day badge - only if explicitly specified */}
                        {task.timeOfDay && task.timeOfDay !== 'libre' && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/80 border border-stone-200 text-stone-700 shrink-0">
                            {task.timeOfDay === 'matin' && '🌅 Matin'}
                            {task.timeOfDay === 'apres_midi' && '☀️ Après-midi'}
                            {task.timeOfDay === 'soir' && '🌙 Soirée'}
                          </span>
                        )}

                        {/* Routine recurring badge */}
                        {task.isRoutine && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1 shrink-0">
                            <Repeat className="w-3 h-3 text-purple-700" />
                            <span>Tous les {task.intervalDays || 15}j</span>
                          </span>
                        )}

                        {/* Urgent badge */}
                        {task.urgent && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-500 text-white flex items-center gap-1 shrink-0">
                            <AlertCircle className="w-3 h-3" />
                            <span>URGENT</span>
                          </span>
                        )}

                        {/* Difficulty badge */}
                        {task.difficulty && (
                          <span className="text-[10px] text-stone-500 hidden md:inline">
                            • {task.difficulty}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className={`text-sm sm:text-base font-bold font-display ${
                        task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}>
                        {task.title}
                      </h4>

                      {/* Description / Instructions preview */}
                      {task.description && (
                        <p className="text-xs text-stone-600 line-clamp-1 italic">
                          📝 {task.description}
                        </p>
                      )}

                      {/* Routine last completed information */}
                      {task.isRoutine && task.lastCompletedDate && (
                        <p className="text-[11px] text-purple-900 font-mono">
                          Dernière réalisation : {task.lastCompletedDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Action Controls */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200/60 w-full sm:w-auto justify-end">
                    
                    {/* For routines: Renew button (automatic +intervalDays recurrence) */}
                    {task.isRoutine && (
                      <button
                        onClick={() => renewRoutine(task.id)}
                        title={`Valider et reprogrammer dans ${task.intervalDays || 15} jours`}
                        className="px-2.5 py-1.5 text-xs font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Repeat className="w-3.5 h-3.5 text-purple-700" />
                        <span className="hidden sm:inline">Renouveler</span>
                      </button>
                    )}

                    {/* Quick +1 day postpone */}
                    <button
                      onClick={() => postponeTask(task.id, 1)}
                      title="Reporter de +1 jour"
                      className="px-2 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white/80 hover:bg-white border border-stone-200/80 rounded-xl transition-colors cursor-pointer"
                    >
                      +1j
                    </button>

                    {/* Inline Quick Edit Toggle */}
                    <button
                      onClick={() => setInlineExpandedId(isInlineExpanded ? null : task.id)}
                      title="Modifier rapidement les informations en ligne"
                      className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer flex items-center gap-1 ${
                        isInlineExpanded
                          ? 'bg-amber-900 text-white border-amber-900'
                          : 'bg-white/80 hover:bg-white text-stone-700 border-stone-200/80'
                      }`}
                    >
                      <span>Ajuster</span>
                    </button>

                    {/* Full Complete Edit Modal Button */}
                    <button
                      onClick={() => setTaskToEdit(task)}
                      title="Modifier toutes les informations dans le formulaire complet"
                      className="px-3 py-1.5 text-xs font-bold text-white bg-amber-900 hover:bg-amber-950 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modifier tout</span>
                    </button>

                    {/* Duplicate button */}
                    <button
                      onClick={() => duplicateTask(task.id)}
                      title="Dupliquer cette tâche"
                      className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Supprimer la tâche "${task.title}" ?`)) {
                          deleteTask(task.id);
                        }
                      }}
                      title="Supprimer la tâche"
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>

                {/* Inline Quick Modification Expander */}
                {isInlineExpanded && (
                  <div className="p-4 bg-white/95 border-t border-amber-200/70 rounded-b-2xl space-y-3 animate-fade-in text-xs">
                    <div className="font-bold text-stone-800 flex items-center gap-1.5 text-xs pb-1 border-b border-stone-100">
                      <span>⚡ Modification rapide directe :</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      {/* Change Room */}
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">
                          Pièce de la maison :
                        </label>
                        <select
                          value={task.room}
                          onChange={e => editTask({ ...task, room: e.target.value as RoomType })}
                          className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800"
                        >
                          {roomKeys.map(rk => (
                            <option key={rk} value={rk}>
                              {ROOM_THEMES[rk].icon} {ROOM_THEMES[rk].label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Change Due Date */}
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">
                          Date d'échéance :
                        </label>
                        <input
                          type="date"
                          value={task.dueDate}
                          onChange={e => editTask({ ...task, dueDate: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-800 font-semibold"
                        />
                      </div>

                      {/* Change Time of Day */}
                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">
                          Créneau horaire :
                        </label>
                        <select
                          value={task.timeOfDay}
                          onChange={e => editTask({ ...task, timeOfDay: e.target.value as TimeOfDay })}
                          className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800"
                        >
                          <option value="libre">📋 Sans préférence horaire</option>
                          <option value="matin">🌅 Matin (07h-09h)</option>
                          <option value="apres_midi">☀️ Après-midi (16h-18h)</option>
                          <option value="soir">🌙 Soirée (19h-21h)</option>
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      
                      {/* Routine toggle & days */}
                      <div className="flex items-center gap-3 p-2 bg-purple-50/70 rounded-xl border border-purple-200/70">
                        <label className="flex items-center gap-1.5 font-bold text-purple-950 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!task.isRoutine}
                            onChange={e => editTask({ 
                              ...task, 
                              isRoutine: e.target.checked,
                              intervalDays: e.target.checked ? (task.intervalDays || 15) : undefined,
                            })}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                          <span>Routine récurrente</span>
                        </label>

                        {task.isRoutine && (
                          <div className="flex items-center gap-1">
                            <span className="text-purple-800">tous les</span>
                            <input
                              type="number"
                              min="1"
                              max="180"
                              value={task.intervalDays || 15}
                              onChange={e => editTask({ ...task, intervalDays: Number(e.target.value) })}
                              className="w-14 px-2 py-0.5 text-center bg-white border border-purple-300 rounded-lg font-bold"
                            />
                            <span className="text-purple-800">jours</span>
                          </div>
                        )}
                      </div>

                      {/* Urgent toggle */}
                      <div className="flex items-center justify-between p-2 bg-stone-50 rounded-xl border border-stone-200">
                        <label className="flex items-center gap-1.5 font-bold text-stone-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!task.urgent}
                            onChange={e => editTask({ ...task, urgent: e.target.checked })}
                            className="w-4 h-4 text-rose-600 rounded"
                          />
                          <span>Marquer comme urgent</span>
                        </label>

                        <button
                          onClick={() => setTaskToEdit(task)}
                          className="text-amber-900 font-bold hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <span>Voir formulaire complet</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Task Edit Modal with ALL possible information */}
      <TaskEditModal
        isOpen={!!taskToEdit}
        task={taskToEdit}
        onClose={() => setTaskToEdit(null)}
      />

    </div>
  );
};
