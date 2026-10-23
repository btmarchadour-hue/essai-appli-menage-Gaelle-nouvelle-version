import React from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Wrench, 
  RotateCcw,
  ShieldAlert,
  Info
} from 'lucide-react';

export const AlertsCenterView: React.FC = () => {
  const {
    alerts,
    toggleTask,
    postponeTask,
    recordMaintenance,
    setActiveTab,
  } = useHousehold();

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const warningAlerts = alerts.filter(a => a.severity === 'warning');
  const infoAlerts = alerts.filter(a => a.severity === 'info');

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-6 h-6 text-rose-200" />
              <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight">
                Centre d'Alertes & Urgences du Foyer
              </h1>
            </div>
            <p className="text-rose-100 text-sm max-w-2xl">
              Anticipez les oublis, rattrapez les corvées en retard et surveillez la maintenance des équipements de la maison.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-white/20 backdrop-blur-xs px-3.5 py-1.5 rounded-xl text-xs font-bold text-white font-mono tabular-nums">
              {alerts.length} alerte{alerts.length > 1 ? 's' : ''} active{alerts.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Quick Summary Pill Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/20 text-white">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-xs text-rose-200 block">Retards critiques</span>
            <span className="text-2xl font-bold font-mono tabular-nums">
              {criticalAlerts.length}
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-xs text-amber-200 block">Priorités du jour</span>
            <span className="text-2xl font-bold font-mono tabular-nums">
              {warningAlerts.length}
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-xs text-sky-200 block">Rappels & vérifications</span>
            <span className="text-2xl font-bold font-mono tabular-nums">
              {infoAlerts.length}
            </span>
          </div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/90 shadow-xs">
          <span className="text-4xl block mb-2">🎉</span>
          <h3 className="text-base font-bold text-slate-800">Aucune alerte en cours !</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            La maison est parfaitement à jour : zéro corvée en retard et tous les équipements sont révisés.
          </p>
          <button
            onClick={() => setActiveTab('agenda')}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Voir l'Agenda des Tâches</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* 1. Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Retards critiques ({criticalAlerts.length})</span>
              </h2>

              <div className="space-y-2.5">
                {criticalAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                        {alert.sourceType === 'task' || alert.sourceType === 'routine' ? (
                          <Clock className="w-5 h-5" />
                        ) : (
                          <Wrench className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                            En retard
                          </span>
                          <span className="text-xs text-slate-400 font-mono tabular-nums">
                            Échéance : {alert.dueDate}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 mt-1">
                          {alert.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    </div>

                    {/* Direct Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {(alert.sourceType === 'task' || alert.sourceType === 'routine') && (
                        <>
                          <button
                            onClick={() => postponeTask(alert.sourceId, 1)}
                            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reporter à demain</span>
                          </button>

                          <button
                            onClick={() => toggleTask(alert.sourceId)}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>C'est fait !</span>
                          </button>
                        </>
                      )}

                      {alert.sourceType === 'equipment' && (
                        <button
                          onClick={() => recordMaintenance(alert.sourceId)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Entretien effectué</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Warning Alerts */}
          {warningAlerts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>À faire aujourd'hui ou bientôt ({warningAlerts.length})</span>
              </h2>

              <div className="space-y-2.5">
                {warningAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                        {alert.sourceType === 'task' || alert.sourceType === 'routine' ? (
                          <Clock className="w-5 h-5" />
                        ) : (
                          <Wrench className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                            Attention
                          </span>
                          <span className="text-xs text-slate-400 font-mono tabular-nums">
                            Échéance : {alert.dueDate}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 mt-1">
                          {alert.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {(alert.sourceType === 'task' || alert.sourceType === 'routine') && (
                        <button
                          onClick={() => toggleTask(alert.sourceId)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Marquer fait</span>
                        </button>
                      )}

                      {alert.sourceType === 'equipment' && (
                        <button
                          onClick={() => recordMaintenance(alert.sourceId)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Entretien fait</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Info Reminders */}
          {infoAlerts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Rappels & anticipations ({infoAlerts.length})</span>
              </h2>

              <div className="space-y-2.5">
                {infoAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <Wrench className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <span className="text-xs text-slate-400 font-mono tabular-nums">
                          Échéance prévue : {alert.dueDate}
                        </span>
                        <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                          {alert.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {alert.message}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('maison')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all self-end sm:self-auto"
                    >
                      Voir le carnet maison →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
