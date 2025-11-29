import React, { useRef } from 'react';
import { X, Download, Upload, Database, AlertTriangle } from 'lucide-react';
import { AppState, BackupData } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: AppState;
  onImport: (state: AppState) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentState, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const backup: BackupData = {
      version: 1,
      date: new Date().toISOString(),
      state: currentState
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `foco_vital_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Simple validation
        if (json.version && json.state && Array.isArray(json.state.tasks)) {
            if(window.confirm("Esto sobrescribirá tus datos actuales. ¿Estás seguro?")) {
                onImport(json.state);
                onClose();
            }
        } else {
            alert("El archivo no tiene un formato válido.");
        }
      } catch (err) {
        alert("Error al leer el archivo. Asegúrate de que es un JSON válido.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-stone-800">Soberanía de Datos</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full text-stone-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-stone-600">
            Tus datos viven en este dispositivo. Foco Vital no rastrea nada. 
            Usa estas opciones para mover tus datos o guardarlos.
          </p>

          <div className="space-y-3">
            <button 
                onClick={handleExport}
                className="w-full flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 hover:border-sage-300 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-sage-100 text-sage-700 rounded-lg group-hover:bg-sage-200">
                        <Download className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <span className="block font-medium text-stone-800">Crear Copia de Seguridad</span>
                        <span className="block text-xs text-stone-500">Descargar archivo .JSON</span>
                    </div>
                </div>
            </button>

            <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 hover:border-amber-300 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-lg group-hover:bg-amber-200">
                        <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <span className="block font-medium text-stone-800">Restaurar Datos</span>
                        <span className="block text-xs text-stone-500">Importar desde archivo .JSON</span>
                    </div>
                </div>
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json"
                onChange={handleFileChange}
            />
          </div>

          <div className="pt-4 border-t border-stone-100">
            <div className="flex gap-2 items-start text-xs text-stone-400">
                <Database className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Almacenamiento Local (IndexedDB). Si borras la caché del navegador, podrías perder los datos sin una copia de seguridad.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};