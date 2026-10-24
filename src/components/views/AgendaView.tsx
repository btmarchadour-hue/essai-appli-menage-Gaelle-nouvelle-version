import React, { useState, useMemo } from 'react';
import { useHousehold, TODAY_STR } from '../../context/HouseholdContext';
import { ChoreTask, RoomType, TimeOfDay } from '../../types';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Circle,
  RotateCcw,
  CalendarDays,
  LayoutList,
  AlertTriangle,
  Sun,
  Sunset,
  Sunrise,
  Layers,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Filter,
  HelpCircle,
  Home
} from 'lucide-react';
import { TaskCleanerModal } from '../modals/TaskCleanerModal';
import { TaskEditModal } from '../modals/TaskEditModal';

export const ROOM_THEMES: Record<RoomType, {
  label: string;
  icon: string;
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  barColor: string;
  dotColor: string;
}> = {
  cuisine: {
    label: 'Cuisine',
    icon: '🍳',
    cardBg: 'bg-amber-50/90 hover:bg-amber-100/70',
    cardBorder: 'border-amber-300/80',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-950',
    barColor: 'bg-amber-500',
    dotColor: 'bg-amber-500',
  },
  salon: {
    label: 'Salon',
    icon: '🛋️',
    cardBg: 'bg-orange-50/90 hover:bg-orange-100/70',
    cardBorder: 'border-orange-300/80',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-950',
    barColor: 'bg-orange-500',
    dotColor: 'bg-orange-500',
  },
  chambres: {
    label: 'Chambres',
    icon: '🛏️',
    cardBg: 'bg-rose-50/90 hover:bg-rose-100/70',
    cardBorder: 'border-rose-300/80',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-950',
    barColor: 'bg-rose-500',
    dotColor: 'bg-rose-500',
  },
  salle_de_bain: {
    label: 'Salle de bain',
    icon: '🛁',
    cardBg: 'bg-teal-50/90 hover:bg-teal-100/70',
    cardBorder: 'border-teal-300/80',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-950',
    barColor: 'bg-teal-500',
    dotColor: 'bg-teal-500',
  },
  exterieur: {
    label: 'Jardin & Balcon',
    icon: '🌿',
    cardBg: 'bg-emerald-50/90 hover:bg-emerald-100/70',
    cardBorder: 'border-emerald-300/80',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-950',
    barColor: 'bg-emerald-600',
    dotColor: 'bg-emerald-600',
  },
  entree: {
    label: 'Entrée & Couloirs',
    icon: '🚪',
    cardBg: 'bg-stone-50/90 hover:bg-stone-100/70',
    cardBorder: 'border-amber-300/70',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-stone-900',
    barColor: 'bg-amber-600',
    dotColor: 'bg-amber-600',
  },
  toute_la_maison: {
    label: 'Toute la maison',
    icon: '🏡',
    cardBg: 'bg-amber-50/80 hover:bg-amber-100/70',
    cardBorder: 'border-orange-300/80',
    badgeBg: 'bg-amber-200/80',
    badgeText: 'text-amber-950',
    barColor: 'bg-amber-600',
    dotColor: 'bg-amber-600',
  },
};

const TIME_SLOTS: { id: TimeOfDay; label: string; icon: React.ReactNode; period: string }[] = [
  { id: 'matin', label: 'Matin (07h-09h)', icon: <Sunrise className="w-4 h-4 text-amber-500" />, period: 'Matin' },
  { id: 'apres_midi', label: 'Après-midi (16h-18h)', icon: <Sun className="w-4 h-4 text-orange-500" />, period: 'Après-midi' },
  { id: 'soir', label: 'Soirée (19h-21h)', icon: <Sunset className="w-4 h-4 text-indigo-500" />, period: 'Soirée' },
  { id: 'libre', label: 'En journée', icon: <Layers className="w-4 h-4 text-teal-500" />, period: 'Libre' },
];

// Helper: generate 7 days for a given week offset from Monday 19 Octobre 2026
function computeWeekDays(offsetWeeks: number) {
  const baseMonday = new Date(2026, 9, 19); // 19 Octobre 2026 is Monday
  baseMonday.setDate(baseMonday.getDate() + offsetWeeks * 7);

  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseMonday);
    d.setDate(baseMonday.getDate() + i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayName = dayNames[i];
    const monthName = monthNames[d.getMonth()];

    days.push({
      date: dateStr,
      label: dayLabels[i],
      num: String(d.getDate()),
      name: `${dayName} ${d.getDate()} ${monthName}`,
      short: dayName,
      month: monthName,
      year: yyyy,
    });
  }
  return days;
}

interface AgendaViewProps {
  onOpenAddTask: () => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({ onOpenAddTask }) => {
  const {
    tasks,
    selectedDate,
    setSelectedDate,
    toggleTask,
    postponeTask,
    alerts,
    setActiveTab,
  } = useHousehold();

  // View modes: 'week' (interactive weekly calendar), 'day' (chronological timeline), 'rooms' (grouped by room)
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'rooms'>('week');
  
  // Active room filter: 'all' or specific RoomType
  const [activeRoomFilter, setActiveRoomFilter] = useState<RoomType | 'all'>('all');

  // Week navigation offset (0 = current week, 1 = next week, etc.)
  const [weekOffset, setWeekOffset] = useState<number>(0);
  
  const [isCleanerOpen, setIsCleanerOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ChoreTask | null>(null);
  const [showHowToTest, setShowHowToTest] = useState(true);

  // Computed 7-day week schedule based on weekOffset
  const currentWeekDays = useMemo(() => computeWeekDays(weekOffset), [weekOffset]);
  const weekStart = currentWeekDays[0];
  const weekEnd = currentWeekDays[6];

  // Overdue tasks
  const overdueTasks = useMemo(() => {
    return tasks.filter(t => !t.completed && t.dueDate < TODAY_STR);
  }, [tasks]);

  // Tasks filtered by room
  const filteredTasks = useMemo(() => {
    if (activeRoomFilter === 'all') return tasks;
    return tasks.filter(t => t.room === activeRoomFilter);
  }, [tasks, activeRoomFilter]);

  // Tasks belonging to this week
  const weekTasks = useMemo(() => {
    const dates = new Set(currentWeekDays.map(d => d.date));
    return filteredTasks.filter(t => dates.has(t.dueDate));
  }, [filteredTasks, currentWeekDays]);

  // Tasks for current selected date in 'day' mode
  const selectedDateTasks = useMemo(() => {
    return filteredTasks.filter(t => t.dueDate === selectedDate);
  }, [filteredTasks, selectedDate]);

  // Tasks grouped by time slots for 'day' mode
  const tasksBySlot = useMemo(() => {
    const map: Record<TimeOfDay, ChoreTask[]> = {
      matin: [],
      apres_midi: [],
      soir: [],
      libre: [],
    };
    selectedDateTasks.forEach(t => {
      const slot = t.timeOfDay || 'libre';
      map[slot].push(t);
    });
    return map;
  }, [selectedDateTasks]);

  const allRooms: RoomType[] = ['cuisine', 'salon', 'chambres', 'salle_de_bain', 'entree', 'exterieur', 'toute_la_maison'];

  return (
    <div className="space-y-6">
      
      {/* 1. TOP ALERT BAR (If Overdue Chores exist) */}
      {overdueTasks.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <strong className="block text-sm font-bold text-rose-900">
                {overdueTasks.length} corvée(s) en retard dans la maison !
              </strong>
              <span>
                « {overdueTasks[0].title} » ({ROOM_THEMES[overdueTasks[0].room]?.label || overdueTasks[0].room}).
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => postponeTask(overdueTasks[0].id, 1)}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all"
            >
              Reporter à aujourd'hui
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs"
            >
              Voir les alertes ({alerts.length})
            </button>
          </div>
        </div>
      )}

      {/* 2. WARM WELCOME & COZY HOME BANNER */}
      <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-stone-50 border border-amber-200/80 rounded-2xl p-4 text-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-lg shadow-sm shadow-orange-500/20 shrink-0">
            ☀️
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold font-display text-amber-950 flex items-center gap-2">
              <span>Mon Foyer Douillet & Organisé</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200/70">
                Aujourd'hui
              </span>
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Chaque petite corvée accomplie apporte calme et sérénité dans votre maison 🌿
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0">
          <a
            href="#guide-utilisateur"
            className="px-3.5 py-1.5 rounded-xl bg-amber-100/90 hover:bg-amber-200/90 text-amber-950 font-bold border border-amber-300/70 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>📖 Guide & Astuces</span>
            <span className="text-amber-700">↓</span>
          </a>
        </div>
      </div>

      {/* 3. AGENDA CONTROL HEADER */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-4">
        
        {/* Top line: Title & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-amber-100">
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-amber-600" />
              <h1 className="text-lg font-bold text-stone-900 font-display">
                Calendrier Hebdomadaire des Corvées
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Code couleur par pièce de la maison · Touchez ou cliquez sur une corvée pour l'ajuster.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center flex-wrap gap-2 shrink-0">
            
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-amber-50/80 border border-amber-200/50 rounded-2xl">
              <button
                onClick={() => setViewMode('week')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  viewMode === 'week'
                    ? 'bg-white text-amber-950 shadow-xs ring-1 ring-amber-300/60'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                <span>Semaine</span>
              </button>

              <button
                onClick={() => setViewMode('day')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  viewMode === 'day'
                    ? 'bg-white text-amber-950 shadow-xs ring-1 ring-amber-300/60'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5 text-stone-500" />
                <span>Jour</span>
              </button>

              <button
                onClick={() => setViewMode('rooms')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  viewMode === 'rooms'
                    ? 'bg-white text-amber-950 shadow-xs ring-1 ring-amber-300/60'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-stone-500" />
                <span>Par Pièce</span>
              </button>
            </div>

            {/* Clean Up Tasks Button */}
            <button
              onClick={() => setIsCleanerOpen(true)}
              title="Supprimer les tâches superflues"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/60 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <span>🧹</span>
              <span>Faire du tri</span>
            </button>

            {/* Add Task */}
            <button
              onClick={() => {
                setSelectedDate(TODAY_STR);
                onOpenAddTask();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Planifier</span>
            </button>
          </div>
        </div>

        {/* ROOM FILTER BAR WITH LIVE TASK COUNTS */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrer par pièce :</span>
          </span>

          <button
            onClick={() => setActiveRoomFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeRoomFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <span>🏡</span>
            <span>Toutes les pièces</span>
            <span className="text-[10px] opacity-75 font-mono">({tasks.filter(t => !t.completed).length})</span>
          </button>

          {allRooms.map(roomKey => {
            const theme = ROOM_THEMES[roomKey];
            const isSelected = activeRoomFilter === roomKey;
            const count = tasks.filter(t => t.room === roomKey && !t.completed).length;

            return (
              <button
                key={roomKey}
                onClick={() => setActiveRoomFilter(roomKey)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-indigo-400'
                    : `${theme.cardBg} ${theme.cardBorder} text-slate-800 hover:shadow-xs`
                }`}
              >
                <span>{theme.icon}</span>
                <span>{theme.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* 4. VIEW MODE A: INTERACTIVE 7-DAY WEEKLY CALENDAR */}
      {viewMode === 'week' && (
        <div className="space-y-4">
          
          {/* Week Navigation Header */}
          <div className="bg-[#FFFDF9] rounded-3xl p-4 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekOffset(prev => prev - 1)}
                title="Semaine précédente"
                className="p-1.5 text-stone-600 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-stone-900 font-display">
                    Semaine du {weekStart.num} {weekStart.month} au {weekEnd.num} {weekEnd.month} {weekEnd.year}
                  </span>
                  {weekOffset === 0 ? (
                    <span className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-200/70">
                      Cette semaine
                    </span>
                  ) : weekOffset > 0 ? (
                    <span className="text-[11px] bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded-full border border-orange-200/70">
                      +{weekOffset} sem.
                    </span>
                  ) : (
                    <span className="text-[11px] bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded-full border border-stone-200">
                      {weekOffset} sem.
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-500">
                  {weekTasks.filter(t => !t.completed).length} tâche(s) programmée(s) cette semaine
                </span>
              </div>

              <button
                onClick={() => setWeekOffset(prev => prev + 1)}
                title="Semaine suivante"
                className="p-1.5 text-stone-600 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {weekOffset !== 0 && (
                <button
                  onClick={() => setWeekOffset(0)}
                  className="px-3 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/70 rounded-xl transition-colors cursor-pointer"
                >
                  Revenir à cette semaine
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedDate(TODAY_STR);
                  onOpenAddTask();
                }}
                className="px-3.5 py-1.5 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une corvée</span>
              </button>
            </div>
          </div>

          {/* Interactive 7-Day Grid */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-start">
            {currentWeekDays.map(day => {
              const dayTasks = filteredTasks.filter(t => t.dueDate === day.date);
              const isToday = day.date === TODAY_STR;
              const pendingCount = dayTasks.filter(t => !t.completed).length;

              return (
                <div
                  key={day.date}
                  className={`bg-[#FFFDF9] rounded-2xl border transition-all flex flex-col min-h-[420px] shadow-xs ${
                    isToday
                      ? 'border-amber-400 ring-2 ring-amber-300/40 shadow-sm'
                      : 'border-amber-200/60'
                  }`}
                >
                  {/* Column Day Header */}
                  <div className={`p-3 border-b flex items-center justify-between rounded-t-2xl ${
                    isToday ? 'bg-amber-100/70 border-amber-200/80' : 'bg-stone-50/80 border-amber-100/70'
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-stone-900 uppercase">
                          {day.label}
                        </span>
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black font-mono ${
                          isToday ? 'bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-2xs' : 'bg-stone-200/90 text-stone-800'
                        }`}>
                          {day.num}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-semibold block mt-0.5">
                        {isToday ? "Aujourd'hui · " : ''}
                        {pendingCount > 0 ? `${pendingCount} à faire` : '✓ À jour'}
                      </span>
                    </div>

                    {/* Quick Add on this Day */}
                    <button
                      onClick={() => {
                        setSelectedDate(day.date);
                        onOpenAddTask();
                      }}
                      title={`Ajouter une tâche le ${day.short} ${day.num}`}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Tasks List in this Day */}
                  <div className="p-2 space-y-2.5 flex-1">
                    {dayTasks.length === 0 ? (
                      <div className="py-14 text-center text-[11px] text-stone-400 italic">
                        <span>Rien ce jour</span>
                        <button
                          onClick={() => {
                            setSelectedDate(day.date);
                            onOpenAddTask();
                          }}
                          className="block mx-auto mt-2 text-[10px] text-amber-700 hover:underline font-bold cursor-pointer"
                        >
                          + Ajouter
                        </button>
                      </div>
                    ) : (
                      dayTasks.map(task => {
                        const theme = ROOM_THEMES[task.room] || ROOM_THEMES.toute_la_maison;

                        return (
                          <div
                            key={task.id}
                            onClick={() => setTaskToEdit(task)}
                            title="Cliquez pour modifier les détails de la tâche"
                            className={`group relative rounded-xl border p-2.5 transition-all text-xs flex flex-col justify-between cursor-pointer ${
                              task.completed
                                ? 'bg-slate-50/70 border-slate-200 opacity-60'
                                : `${theme.cardBg} ${theme.cardBorder} shadow-2xs hover:shadow-md hover:scale-[1.01]`
                            }`}
                          >
                            {/* Room Color Accent Bar (Left 4px) */}
                            <div className={`absolute top-0 left-0 bottom-0 w-1 rounded-l-xl ${theme.barColor}`} />

                            <div className="pl-1.5">
                              {/* Room Badge & Time slot */}
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${theme.badgeBg} ${theme.badgeText}`}>
                                  <span>{theme.icon}</span>
                                  <span>{theme.label}</span>
                                </span>

                                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                  {task.timeOfDay === 'matin' && <span title="Matin">🌅 Matin</span>}
                                  {task.timeOfDay === 'apres_midi' && <span title="Après-midi">☀️ A-M</span>}
                                  {task.timeOfDay === 'soir' && <span title="Soirée">🌙 Soir</span>}
                                  {task.timeOfDay === 'libre' && <span title="En journée">📋 Jour</span>}
                                </div>
                              </div>

                              {/* Task Title */}
                              <h4
                                className={`font-bold text-slate-900 leading-snug ${
                                  task.completed ? 'line-through text-slate-400' : 'group-hover:text-indigo-600 transition-colors'
                                }`}
                              >
                                {task.title}
                              </h4>

                              {task.description && (
                                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              {task.isRoutine && (
                                <div className="mt-1.5 text-[10px] font-bold text-indigo-700 flex items-center gap-1 bg-indigo-50/80 px-1.5 py-0.5 rounded border border-indigo-100">
                                  <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                                  <span>Routine tous les {task.intervalDays}j</span>
                                </div>
                              )}
                            </div>

                            {/* Card Footer Actions */}
                            <div 
                              className="pl-1.5 pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between"
                              onClick={e => e.stopPropagation()} // Don't trigger card modal when clicking buttons
                            >
                              {/* Complete check button */}
                              <button
                                onClick={() => toggleTask(task.id)}
                                title={task.completed ? 'Marquer comme non fait' : 'Valider'}
                                className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-emerald-600 transition-colors"
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-300 hover:text-emerald-500" />
                                )}
                                <span>{task.completed ? 'Fait' : 'Valider'}</span>
                              </button>

                              {/* Actions: Postpone & Edit */}
                              <div className="flex items-center gap-1">
                                {!task.completed && (
                                  <button
                                    onClick={() => postponeTask(task.id, 1)}
                                    title="Reporter au jour suivant (+1j)"
                                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-colors text-[10px] font-mono"
                                  >
                                    +1j
                                  </button>
                                )}

                                <button
                                  onClick={() => setTaskToEdit(task)}
                                  title="Modifier les détails"
                                  className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Day Footer */}
                  <div className="p-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setSelectedDate(day.date);
                        setViewMode('day');
                      }}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Détails du jour →
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 5. VIEW MODE B: DAY CHRONOLOGICAL TIMELINE */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between px-1 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Programme détaillé du {currentWeekDays.find(d => d.date === selectedDate)?.name || selectedDate}
              </h2>
              <p className="text-xs text-slate-500">
                Organisation chronologique par créneau de la journée
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                {selectedDateTasks.filter(t => t.completed).length} / {selectedDateTasks.length} accomplies
              </span>
              <button
                onClick={() => setViewMode('week')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                ← Retour au calendrier
              </button>
            </div>
          </div>

          {selectedDateTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/90 shadow-xs">
              <span className="text-4xl block mb-2">🌿</span>
              <h3 className="text-base font-bold text-slate-800">Aucune corvée planifiée ce jour</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Profitez de cette journée tranquille ou ajoutez une mission pour votre maison.
              </p>
              <button
                onClick={onOpenAddTask}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Planifier une tâche</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {TIME_SLOTS.map(slot => {
                const slotTasks = tasksBySlot[slot.id];
                if (slotTasks.length === 0) return null;

                return (
                  <div key={slot.id} className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
                    
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        {slot.icon}
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          {slot.label}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {slotTasks.length} tâche(s)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {slotTasks.map(task => {
                        const theme = ROOM_THEMES[task.room] || ROOM_THEMES.toute_la_maison;

                        return (
                          <div
                            key={task.id}
                            onClick={() => setTaskToEdit(task)}
                            className={`p-3.5 rounded-xl border transition-all relative cursor-pointer ${
                              task.completed
                                ? 'bg-slate-50/70 border-slate-200 opacity-80'
                                : `${theme.cardBg} ${theme.cardBorder} shadow-xs hover:shadow-md`
                            }`}
                          >
                            <div className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-l-xl ${theme.barColor}`} />

                            <div className="flex items-start gap-3 pl-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTask(task.id);
                                }}
                                className="min-w-[40px] min-h-[40px] flex items-center justify-center -ml-1 text-slate-400 hover:text-emerald-600 active:scale-90 transition-transform"
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                                ) : (
                                  <Circle className="w-6 h-6 text-slate-300 hover:text-indigo-500" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                                  <span className={`font-bold px-1.5 py-0.2 rounded ${theme.badgeBg} ${theme.badgeText}`}>
                                    {theme.icon} {theme.label}
                                  </span>
                                </div>

                                <h4
                                  className={`text-sm font-bold text-slate-900 ${
                                    task.completed ? 'line-through text-slate-400' : ''
                                  }`}
                                >
                                  {task.title}
                                </h4>

                                {task.description && (
                                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}

                                <div 
                                  className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/60 text-xs"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    Échéance : {task.dueDate}
                                  </span>

                                  <div className="flex items-center gap-1.5">
                                    {!task.completed && (
                                      <button
                                        onClick={() => postponeTask(task.id, 1)}
                                        className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200"
                                      >
                                        +1j
                                      </button>
                                    )}

                                    <button
                                      onClick={() => setTaskToEdit(task)}
                                      className="p-1 text-slate-400 hover:text-indigo-600 bg-white rounded border border-slate-200"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* 6. VIEW MODE C: SWIMLANE PAR PIÈCE */}
      {viewMode === 'rooms' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allRooms.map(roomKey => {
              const theme = ROOM_THEMES[roomKey];
              const roomTasks = tasks.filter(t => t.room === roomKey);
              const pendingCount = roomTasks.filter(t => !t.completed).length;

              return (
                <div
                  key={roomKey}
                  className={`bg-white rounded-2xl border p-4 flex flex-col justify-between shadow-xs ${theme.cardBorder}`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{theme.icon}</span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            {theme.label}
                          </h3>
                          <span className="text-[11px] text-slate-400">
                            {roomTasks.length} tâche(s) au total
                          </span>
                        </div>
                      </div>

                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText}`}>
                        {pendingCount} à faire
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 mt-2 space-y-1">
                      {roomTasks.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400 italic">
                          Aucune tâche dans cette pièce !
                        </div>
                      ) : (
                        roomTasks.map(task => {
                          return (
                            <div key={task.id} className="pt-2 pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2 min-w-0">
                                  <button
                                    onClick={() => toggleTask(task.id)}
                                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                                  >
                                    {task.completed ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-slate-300 hover:text-indigo-500" />
                                    )}
                                  </button>

                                  <div className="min-w-0">
                                    <h4
                                      onClick={() => setTaskToEdit(task)}
                                      className={`text-xs font-bold cursor-pointer hover:text-indigo-600 ${
                                        task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                                      }`}
                                    >
                                      {task.title}
                                    </h4>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                      <span className="font-mono">{task.dueDate}</span>
                                      {task.isRoutine && (
                                        <span className="text-indigo-600 font-semibold">· {task.intervalDays}j</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => setTaskToEdit(task)}
                                  title="Modifier"
                                  className="text-slate-300 hover:text-indigo-600 p-0.5 transition-colors shrink-0"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      {roomTasks.filter(t => t.completed).length} / {roomTasks.length} faites
                    </span>
                    <button
                      onClick={() => {
                        setSelectedDate(TODAY_STR);
                        onOpenAddTask();
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      + Ajouter ici
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Cleaner Modal */}
      <TaskCleanerModal
        isOpen={isCleanerOpen}
        onClose={() => setIsCleanerOpen(false)}
      />

      {/* Task Edit Modal */}
      <TaskEditModal
        task={taskToEdit}
        isOpen={!!taskToEdit}
        onClose={() => setTaskToEdit(null)}
      />

    </div>
  );
};
