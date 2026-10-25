import React, { useState } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import {
  BookOpen,
  Smartphone,
  Trophy,
  Repeat,
  Calendar,
  ShieldCheck,
  ChevronDown,
  Share2,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  shortLabel: string;
  icon: string;
  badge: string;
  summary: string;
  content: React.ReactNode;
}

export const UserGuideView: React.FC = () => {
  const { triggerCongratulations, setActiveTab } = useHousehold();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    mobile: true,
    tasks_manager: true,
    chuck: false,
    routines: false,
    agenda: false,
    donnees: false,
  });

  const [isAllOpen, setIsAllOpen] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const nextState = !isAllOpen;
    setIsAllOpen(nextState);
    setOpenSections({
      mobile: nextState,
      tasks_manager: nextState,
      chuck: nextState,
      routines: nextState,
      agenda: nextState,
      donnees: nextState,
    });
  };

  const sections: GuideSection[] = [
    {
      id: 'mobile',
      title: '📱 Utilisation sur Smartphone & Écran d’accueil',
      shortLabel: 'Mobile & Plein Écran',
      icon: '📱',
      badge: 'Expérience Mobile',
      summary: 'Installez TribuMénage sur votre téléphone comme une véritable application sans passer par un store.',
      content: (
        <div className="space-y-3 text-stone-700 text-xs sm:text-sm">
          <p className="leading-relaxed">
            L'application est 100% pensée pour un usage au smartphone (navigation au pouce en bas de l'écran, cartes tactiles, zéro zoom parasite).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/70">
              <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs mb-1">
                🍏 Sur iPhone (Safari)
              </span>
              <ol className="list-decimal list-inside space-y-1 text-xs text-stone-600">
                <li>Ouvrez le lien dans <strong>Safari</strong>.</li>
                <li>Touchez l’icône <strong>Partager</strong> <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-amber-700" /> (le carré avec la flèche vers le haut).</li>
                <li>Faites défiler et choisissez <strong>« Sur l'écran d'accueil »</strong>.</li>
                <li>L’application s’ouvre désormais en plein écran comme une vraie appli native !</li>
              </ol>
            </div>

            <div className="p-3.5 bg-orange-50/80 rounded-2xl border border-orange-200/70">
              <span className="font-bold text-orange-950 flex items-center gap-1.5 text-xs mb-1">
                🤖 Sur Android (Chrome)
              </span>
              <ol className="list-decimal list-inside space-y-1 text-xs text-stone-600">
                <li>Ouvrez le lien dans <strong>Google Chrome</strong>.</li>
                <li>Touchez les <strong>3 petits points</strong> en haut à droite.</li>
                <li>Sélectionnez <strong>« Installer l'application »</strong> ou « Ajouter à l'écran d'accueil ».</li>
                <li>Accédez-y directement d’un clic depuis votre écran d’applications.</li>
              </ol>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-stone-100/80 rounded-xl text-stone-600 text-xs">
            <Smartphone className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Astuce du pouce :</strong> La barre de navigation reste ancrée en bas de votre écran pour naviguer facilement d'une seule main.
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'tasks_manager',
      title: '📋 Onglet Tâches : Modifier TOUTES les informations',
      shortLabel: 'Toutes les Infos',
      icon: '✏️',
      badge: 'Contrôle Total',
      summary: 'Visualisez, filtrez et modifiez chaque détail : titre, pièce, échéance, heure, cycle en jours, urgence.',
      content: (
        <div className="space-y-3 text-stone-700 text-xs sm:text-sm">
          <p className="leading-relaxed">
            L'onglet <strong>Tâches</strong> centralise toutes vos corvées et routines en un tableau de bord complet où <strong>absolument toutes les informations</strong> sont modifiables à tout moment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70">
              <span className="font-bold text-amber-950 block mb-1">1. Toutes les infos</span>
              <span className="text-stone-600">Intitulé, pièce, date, heure, routine en jours, dernière réalisation, consignes et urgence.</span>
            </div>
            <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-200/70">
              <span className="font-bold text-orange-950 block mb-1">2. En 1 clic ou en détail</span>
              <span className="text-stone-600">Bouton « Ajuster » pour des changements rapides ou « Modifier tout » pour le formulaire complet.</span>
            </div>
            <div className="p-3 bg-stone-100/70 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">3. Tri & Recherche</span>
              <span className="text-stone-600">Filtrez par pièce, statut (fait / à faire), routines de draps, ou recherchez un mot-clé.</span>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className="px-3.5 py-1.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Ouvrir l'onglet Tâches</span>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'agenda',
      title: '📅 Agenda : Affichage au Jour & Calendrier Semaine',
      shortLabel: 'Vue Jour & Semaine',
      icon: '🗓️',
      badge: 'Organisation Quotidienne',
      summary: 'Parcourez votre programme du jour avec navigation jour par jour, ruban des 7 jours et vue semaine.',
      content: (
        <div className="space-y-3 text-stone-700 text-xs sm:text-sm">
          <p className="leading-relaxed">
            L'Agenda s'ouvre par défaut sur <strong>l'affichage au jour</strong> pour vous permettre de savoir exactement ce qu'il y a à faire aujourd'hui, sans surcharge mentale :
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70">
              <span className="font-bold text-amber-950 block mb-1">Affichage au Jour</span>
              <span className="text-stone-600">Votre journée en un coup d'œil. Utilisez <strong>← Jour précédent</strong> et <strong>Jour suivant →</strong> ou les pastilles de la semaine.</span>
            </div>
            <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-200/70">
              <span className="font-bold text-orange-950 block mb-1">Calendrier Semaine</span>
              <span className="text-stone-600">Vision panoramique de lundi à dimanche. Utilisez les flèches pour inspecter les semaines à venir.</span>
            </div>
            <div className="p-3 bg-stone-100/70 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Par Pièce</span>
              <span className="text-stone-600">Regroupe vos corvées par espace (Cuisine, Salon, Chambres...) pour nettoyer zone par zone.</span>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('agenda')}
              className="px-3.5 py-1.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Consulter l'Agenda</span>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'routines',
      title: '🛏️ Routines Récurrentes (Draps tous les 15 jours, etc.)',
      shortLabel: 'Cycles & Cadences',
      icon: '🔄',
      badge: 'Automatisation',
      summary: 'Automatisez les tâches cycliques : draps, serviettes, détartrage, grand ménage.',
      content: (
        <div className="space-y-3 text-stone-700 text-xs sm:text-sm">
          <p className="leading-relaxed">
            Certaines tâches ne se font ni tous les jours ni à jour fixe de la semaine, mais <strong>tous les X jours</strong> (ex. changer les draps tous les 15 jours maximum).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">1. Cadence automatique</span>
              <span className="text-stone-600">Vous définissez l'intervalle (ex: 15 jours pour les draps, 30 jours pour le frigo).</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">2. Validation en 1 clic</span>
              <span className="text-stone-600">Quand vous validez la tâche aujourd'hui, elle est cochée et célébrée avec Chuck Norris.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">3. Recalcul instantané</span>
              <span className="text-stone-600">La prochaine date est automatiquement reprogrammée à J+15 sans calcul mental !</span>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className="px-3.5 py-1.5 text-xs font-bold text-purple-950 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Repeat className="w-3.5 h-3.5 text-purple-700" />
              <span>Gérer les routines dans l'onglet Tâches</span>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'chuck',
      title: '🥋 Citations Chuck Norris & Célébration des corvées',
      shortLabel: 'Chuck Norris & Confettis',
      icon: '🤠',
      badge: 'Bonne Humeur',
      summary: 'Chaque tâche terminée déclenche des confettis et une citation culte de Chuck Norris.',
      content: (
        <div className="space-y-3 text-stone-700 text-xs sm:text-sm">
          <p className="leading-relaxed">
            Parce que passer l'aspirateur ou récurer les toilettes mérite un vrai respect, chaque corvée validée est homologuée en personne par <strong>Chuck Norris</strong> avec confettis et facts hilarants !
          </p>

          <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-left">
              <span className="text-xs font-bold text-amber-950 block">Envie de tester tout de suite ?</span>
              <span className="text-xs text-stone-600">Déclenchez la célébration pour voir comment elle fonctionne :</span>
            </div>
            <button
              onClick={() => triggerCongratulations('Test depuis le Guide')}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-200" />
              <span>Tester une citation Chuck Norris 🤠</span>
            </button>
          </div>

          <div className="text-xs text-stone-600 space-y-1">
            <p>
              • <strong>Bouton « Autre citation » :</strong> Dans la notification, cliquez pour faire défiler d’autres pépites si vous voulez en lire plusieurs.
            </p>
            <p>
              • <strong>Fermeture automatique :</strong> La bannière disparaît toute seule au bout de quelques secondes pour ne pas gêner votre navigation.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'donnees',
      title: '💾 Sauvegarde, Export JSON & Confidentialité Totale',
      shortLabel: 'Données & Backup',
      icon: '🔒',
      badge: '100% Privé',
      summary: 'Toutes vos données restent sur votre appareil. Exportez-les en JSON à tout moment.',
      content: (
        <div className="space-y-3 text-stone-700 text-xs sm:text-sm">
          <p className="leading-relaxed">
            Aucun compte requis, aucun mot de passe oublié : l'application sauvegarde automatiquement votre foyer directement dans votre navigateur (LocalStorage).
          </p>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Comment transférer ou sauvegarder ?</span>
            </div>
            <p>
              Cliquez sur la roue crantée ⚙️ en haut à droite (ou le lien en bas de page) pour <strong>télécharger un fichier JSON</strong>. Vous pouvez ensuite l’importer sur un autre téléphone ou ordinateur en 2 secondes.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner of Guide View */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-sm shadow-amber-900/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-100">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-2xl shadow-md shadow-orange-500/20 shrink-0">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-amber-950 tracking-tight">
                  Guide d'Utilisation & Astuces
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Documentation complète
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Tout ce qu'il faut savoir pour organiser votre foyer sereinement, sur mobile comme sur ordinateur.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={toggleAll}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-all cursor-pointer"
            >
              {isAllOpen ? 'Tout replier' : 'Tout déplier'}
            </button>
          </div>
        </div>

        {/* Quick jump navigation chips */}
        <div className="py-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-amber-100/60">
          <span className="text-[11px] font-bold text-stone-400 shrink-0 mr-1 hidden sm:inline">
            Sections :
          </span>
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => {
                setOpenSections(prev => ({ ...prev, [sec.id]: true }));
                const el = document.getElementById(`guide-tab-card-${sec.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}
              className="text-xs px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-950 whitespace-nowrap transition-colors shrink-0 flex items-center gap-1 border border-stone-200/60 cursor-pointer"
            >
              <span>{sec.icon}</span>
              <span>{sec.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Accordion / Cards List */}
        <div className="space-y-3 mt-4">
          {sections.map(section => {
            const isOpen = !!openSections[section.id];
            return (
              <div
                id={`guide-tab-card-${section.id}`}
                key={section.id}
                className={`rounded-2xl transition-all border ${
                  isOpen
                    ? 'bg-white border-amber-300/80 shadow-xs ring-1 ring-amber-400/20'
                    : 'bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] border-stone-200/70'
                }`}
              >
                {/* Header tap target */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl shrink-0">{section.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-stone-900 font-display">
                          {section.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {section.badge}
                        </span>
                      </div>
                      {!isOpen && (
                        <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                          {section.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 transition-transform ${isOpen ? 'rotate-180 bg-amber-100 text-amber-900' : 'bg-stone-100'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-3.5 sm:px-4 pb-4 pt-1 border-t border-amber-100/60 animate-fade-in">
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Friendly Bottom Note */}
        <div className="mt-6 pt-4 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="text-base">☕</span>
            <span>Prenez un café, organisez votre semaine sans pression. Votre cocon vous remercie !</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('agenda')}
              className="text-amber-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Aller à l'Agenda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
