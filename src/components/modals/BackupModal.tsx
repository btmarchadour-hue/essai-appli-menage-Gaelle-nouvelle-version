import React, { useState } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { X, Download, Upload, RotateCcw, Copy, Check } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { exportData, importData, resetToDefaults } = useHousehold();

  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    const data = exportData();
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadFile = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tribumenage-sauvegarde-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = importData(importText.trim());
    if (success) {
      setStatusMessage('Données importées avec succès !');
      setImportText('');
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1500);
    } else {
      setStatusMessage('Erreur : format de fichier JSON invalide.');
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    resetToDefaults();
    setConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Sauvegarde & Restauration
            </h2>
            <p className="text-xs text-slate-500">
              Exportez vos données de foyer ou synchronisez un autre appareil.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="p-3 bg-slate-900 text-white text-xs font-bold rounded-xl text-center">
            {statusMessage}
          </div>
        )}

        {/* Section 1: Export */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Exporter mes données</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Téléchargez un fichier JSON contenant toutes vos tâches, membres, stocks et dépenses.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger le fichier</span>
            </button>

            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier JSON'}</span>
            </button>
          </div>
        </div>

        {/* Section 2: Import */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Importer ou restaurer</span>
          </h3>
          <textarea
            rows={3}
            placeholder="Collez ici le texte JSON de sauvegarde..."
            value={importText}
            onChange={e => setImportText(e.target.value)}
            className="w-full p-2.5 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={handleImport}
            disabled={!importText.trim()}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold transition-all"
          >
            Restaurer les données
          </button>
        </div>

        {/* Section 3: Reset */}
        <div className="pt-2 flex items-center justify-between">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser les données d'exemple</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-rose-50 p-1.5 rounded-xl border border-rose-200 text-xs">
              <span className="font-bold text-rose-800">Confirmer la réinitialisation ?</span>
              <button
                onClick={handleReset}
                className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700"
              >
                Oui, réinitialiser
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1 text-slate-500 hover:text-slate-800"
              >
                Annuler
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
