import React from 'react';
import { X, BookOpen, Clock, Layers } from 'lucide-react';

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuide: React.FC<HelpGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur px-6 py-4 border-b border-sand-100 flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-sage-800">Guía de la Metodología</h2>
          <button onClick={onClose} className="p-2 hover:bg-sand-100 rounded-full text-sand-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-10 text-sand-800">
          
          <section className="flex gap-4">
            <div className="p-3 bg-sage-100 rounded-2xl h-fit text-sage-700">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 text-sage-900">El Tarro de la Vida</h3>
              <p className="text-sm leading-relaxed mb-4">
                Imagina que tu tiempo es un tarro de cristal. Si primero lo llenas de arena (distracciones, emails triviales), no quedará espacio para las piedras grandes (tus metas vitales).
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="font-bold text-sage-700">Piedras Grandes:</span>
                  <span>Las 2-3 tareas que realmente mueven la aguja. Hazlas primero.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-stone-600">Guijarros:</span>
                  <span>Tareas importantes pero que pueden esperar (reuniones, mantenimiento).</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-orange-600">Arena:</span>
                  <span>Pequeñas cosas que llenan los huecos. No dejes que dominen tu día.</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="flex gap-4">
            <div className="p-3 bg-amber-100 rounded-2xl h-fit text-amber-700">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 text-sage-900">Ritmo Circadiano 50/17</h3>
              <p className="text-sm leading-relaxed">
                El cerebro humano no es una máquina. Funciona en ciclos de alta energía y descanso. 
                La ciencia sugiere trabajar con intensidad durante <strong>50 minutos</strong> y desconectar totalmente durante <strong>17 minutos</strong>.
              </p>
              <p className="text-sm mt-2 text-stone-500 italic">
                En el descanso: Aléjate de las pantallas. Mira al cielo, camina, o simplemente cierra los ojos.
              </p>
            </div>
          </section>

          <section className="flex gap-4">
            <div className="p-3 bg-blue-100 rounded-2xl h-fit text-blue-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 text-sage-900">Los 5 Pilares</h3>
              <p className="text-sm leading-relaxed mb-3">
                Tu capacidad de enfoque depende de tu biología. Cuida estos cimientos cada día:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-sand-50 p-2 rounded">
                    <strong>Sueño:</strong> Dormir 7-8 horas es innegociable.
                </div>
                <div className="bg-sand-50 p-2 rounded">
                    <strong>Energía:</strong> Comida real, hidratación constante.
                </div>
                <div className="bg-sand-50 p-2 rounded">
                    <strong>Movimiento:</strong> El cuerpo quieto estanca la mente.
                </div>
                <div className="bg-sand-50 p-2 rounded">
                    <strong>Naturaleza:</strong> La luz solar regula tu reloj interno.
                </div>
                <div className="bg-sand-50 p-2 rounded col-span-2">
                    <strong>Visión:</strong> Saber POR QUÉ haces lo que haces.
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};