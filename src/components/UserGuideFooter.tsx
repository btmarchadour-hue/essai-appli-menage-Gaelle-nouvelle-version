import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import {
  BookOpen,
  Smartphone,
  Trophy,
  Repeat,
  Calendar,
  Wrench,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Share2,
  Download,
  Info
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

export const UserGuideFooter: React.FC = () => {
  const { triggerCongratulations, setActiveTab } = useHousehold();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    mobile: true,
    chuck: false,
    routines: false,
    agenda: false,
    entretien: false,
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
      chuck: nextState,
      routines: nextState,
      agenda: nextState,
      entretien: nextState,
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
              <strong>Astuce du pouce :</strong> La barre de navigation reste ancrée en bas de votre écran pour passer d'Agenda à Routines d'une seule main.
            </span>
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
              <span className="text-stone-600">Quand vous validez la tâche aujourd'hui, elle est cochée et célébrée.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">3. Recalcul instantané</span>
              <span className="text-stone-600">La prochaine date est automatiquement reprogrammée à J+15 sans calcul mental !</span>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('routines')}
              className="px-3.5 py-1.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Repeat className="w-3.5 h-3.5 text-amber-700" />
              <span>Voir l'onglet Routines</span>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'agenda',
      title: '📅 Agenda Hebdomadaire & Code Couleur par Pièce',
      shortLabel: 'Agenda & Pièces',
      icon: '🗓️',
      badge: 'Organisation',
      summary: 'Visualisez les tâches par jour, par semaine ou par pièce de la maison.',
      content: (
        <div className="space-y-3 text-stone-700 text-xs sm:text-sm">
          <p className="leading-relaxed">
            L'Agenda offre trois manières différentes de voir votre planning pour s'adapter à votre humeur et votre temps :
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70">
              <span className="font-bold text-amber-950 block mb-1">Vue Semaine</span>
              <span className="text-stone-600">Vision globale de lundi à dimanche. Utilisez les flèches <strong>← / →</strong> pour voir les semaines suivantes.</span>
            </div>
            <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-200/70">
              <span className="font-bold text-orange-950 block mb-1">Vue Jour</span>
              <span className="text-stone-600">Découpage de la journée : Matin, Après-midi, Soirée et Libre pour avancer pas à pas.</span>
            </div>
            <div className="p-3 bg-stone-100/70 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Vue Par Pièce</span>
              <span className="text-stone-600">Regroupe vos corvées par pièce (Cuisine, Salon, Chambres...) pour nettoyer zone par zone.</span>
            </div>
          </div>

          <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/50 text-xs text-stone-600">
            <strong>✏️ Modification directe :</strong> Cliquez sur n'importe quelle carte de tâche pour changer son libellé, sa date, sa pièce ou son horaire.
          </div>
        </div>
      ),
    },
    {
      id: 'entretien',
      title: '🔧 Carnet d’Entretien des Équipements & Saisons',
      shortLabel: 'Carnet Maison',
      icon: '🏡',
      badge: 'Longévité',
      summary: 'Surveillez les filtres, la chaudière, la VMC et les corvées saisonnières.',
      content: (
        <div className="space-y-3 text-stone-700 text-xs sm:text-sm">
          <p className="leading-relaxed">
            Un équipement bien entretenu dure 2 à 3 fois plus longtemps. Le carnet maison calcule le nombre de jours restants avant la prochaine révision :
          </p>

          <ul className="list-disc list-inside space-y-1 text-xs text-stone-600 pl-1">
            <li><strong>Décompte intelligent :</strong> Chaque équipement (lave-vaisselle, chaudière, adoucisseur...) affiche les jours restants.</li>
            <li><strong>Alertes préventives :</strong> Vous recevez un rappel 7 jours avant l'échéance dans le centre d'alertes.</li>
            <li><strong>Tâches saisonnières :</strong> Automne (ramonage, feuilles), Hiver (purge radiateurs, sel), Printemps (terrasse, tondeuse), Été (climatisation).</li>
          </ul>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('maison')}
              className="px-3.5 py-1.5 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-700" />
              <span>Ouvrir le Carnet Maison</span>
            </button>
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
    <section
      id="guide-utilisateur"
      aria-label="Guide utilisateur et astuces"
      className="mt-12 mb-6 scroll-mt-20"
    >
      <div className="bg-[#FFFDF9] rounded-3xl border border-amber-200/80 shadow-md shadow-amber-950/5 p-4 sm:p-6 lg:p-8">
        
        {/* Header of the Guide */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-amber-100">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-xl shadow-md shadow-orange-500/20 shrink-0">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold font-display text-stone-900 tracking-tight">
                  Guide d'Utilisation & Astuces du Foyer
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200/70">
                  📱 Mobile First
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Retrouvez toutes les explications pour maîtriser l'application en quelques secondes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={toggleAll}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-all cursor-pointer"
            >
              {isAllOpen ? 'Tout replier' : 'Tout déplier'}
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-3.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-all cursor-pointer hidden sm:inline-flex"
            >
              Haut de page ↑
            </button>
          </div>
        </div>

        {/* Quick mobile jump chips */}
        <div className="py-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-amber-100/60 mb-4">
          <span className="text-[11px] font-bold text-stone-400 shrink-0 mr-1 hidden sm:inline">
            Accès direct :
          </span>
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => {
                setOpenSections(prev => ({ ...prev, [sec.id]: true }));
                const el = document.getElementById(`guide-card-${sec.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-stone-100/80 hover:bg-amber-100 text-stone-700 hover:text-amber-950 whitespace-nowrap transition-colors shrink-0 flex items-center gap-1"
            >
              <span>{sec.icon}</span>
              <span>{sec.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Accordion / Cards List */}
        <div className="space-y-3">
          {sections.map(section => {
            const isOpen = !!openSections[section.id];
            return (
              <div
                id={`guide-card-${section.id}`}
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
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-amber-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Remonter en haut de l'application</span>
            <span>↑</span>
          </button>
        </div>

      </div>
    </section>
  );
};
