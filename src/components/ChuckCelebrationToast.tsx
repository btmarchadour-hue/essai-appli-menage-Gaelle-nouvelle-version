import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, X, RotateCw, CheckCircle2, Quote } from 'lucide-react';
import { useHousehold } from '../context/HouseholdContext';

export const ChuckCelebrationToast: React.FC = () => {
  const { congratulation, dismissCongratulation, shuffleCongratulationQuote } = useHousehold();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (congratulation) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(dismissCongratulation, 300);
      }, 9000); // Display for 9 seconds
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [congratulation, dismissCongratulation]);

  if (!congratulation) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(dismissCongratulation, 250);
  };

  return (
    <div
      className={`fixed z-50 bottom-20 right-3 left-3 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[460px] transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-95 pointer-events-none'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-5 shadow-2xl border border-amber-500/40 ring-1 ring-amber-400/20 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
              <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Homologué par Chuck Norris
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Fait !
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100 truncate max-w-[260px] sm:max-w-[300px]">
                {congratulation.taskTitle}
              </h4>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Fermer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chuck Norris Quote Card */}
        <div className="relative bg-slate-950/60 rounded-xl p-4 border border-amber-500/20 my-2">
          <Quote className="w-6 h-6 text-amber-500/30 absolute -top-2 -left-2 rotate-180" />
          <p className="text-sm sm:text-base font-serif italic text-amber-100 leading-relaxed pl-2 relative z-10">
            « {congratulation.quote} »
          </p>
          <div className="text-right mt-2 text-xs font-semibold tracking-wide text-amber-400/90">
            — Chuck Norris Fact
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-white/10 text-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              shuffleCongratulationQuote();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Autre citation</span>
          </button>

          <button
            onClick={handleClose}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors cursor-pointer"
          >
            Super ! 👍
          </button>
        </div>
      </div>
    </div>
  );
};
