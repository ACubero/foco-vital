import React, { useEffect, useState, useCallback } from 'react';
import { Settings, HelpCircle, Compass, Menu } from 'lucide-react';
import { db } from './lib/db';
import { Task, AppState, PillarState, TaskCategory } from './types';
import { Pillars } from './components/Pillars';
import { FocusTimer } from './components/FocusTimer';
import { JarOfLife } from './components/JarOfLife';
import { HelpGuide } from './components/HelpGuide';
import { SettingsModal } from './components/SettingsModal';

const DEFAULT_PILLARS: PillarState = {
  sueno: false,
  energia: false,
  movimiento: false,
  naturaleza: false,
  vision: false,
  lastUpdated: Date.now()
};

const App: React.FC = () => {
  // --- State ---
  const [intention, setIntention] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pillars, setPillars] = useState<PillarState>(DEFAULT_PILLARS);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // --- Effects (Data Loading) ---
  useEffect(() => {
    const init = async () => {
      try {
        await db.connect();
        
        // Load Tasks
        const loadedTasks = await db.getAllTasks();
        setTasks(loadedTasks.sort((a, b) => b.createdAt - a.createdAt));

        // Load Pillars
        const loadedPillars = await db.getSetting<PillarState>('pillars');
        if (loadedPillars) {
            // Reset pillars if it's a new day
            const lastDate = new Date(loadedPillars.lastUpdated).getDate();
            const today = new Date().getDate();
            if (lastDate !== today) {
                 const newDayPillars = { ...DEFAULT_PILLARS, lastUpdated: Date.now() };
                 setPillars(newDayPillars);
                 await db.saveSetting('pillars', newDayPillars);
            } else {
                setPillars(loadedPillars);
            }
        }

        // Load Intention
        const loadedIntention = await db.getSetting<string>('intention');
        if (loadedIntention) {
             // Reset intention if new day (using same logic as pillars for simplicity, or just keep it persistent)
             // For this app, let's keep intention persistent until changed by user to reduce friction
             setIntention(loadedIntention);
        }

      } catch (error) {
        console.error("Failed to initialize app data", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // --- Handlers ---

  const handleIntentionChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setIntention(newVal);
    await db.saveSetting('intention', newVal);
  };

  const togglePillar = async (key: keyof Omit<PillarState, 'lastUpdated'>) => {
    const newState = { ...pillars, [key]: !pillars[key], lastUpdated: Date.now() };
    setPillars(newState);
    await db.saveSetting('pillars', newState);
  };

  const addTask = async (title: string, category: TaskCategory) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      category,
      completed: false,
      createdAt: Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
    await db.saveTask(newTask);
  };

  const toggleTask = async (id: string, completed: boolean) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const updatedTask = { ...task, completed };
    setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    await db.saveTask(updatedTask);
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await db.deleteTask(id);
  };

  const importState = async (importedState: AppState) => {
    setLoading(true);
    try {
        await db.clearAll();
        
        // Restore tasks
        for (const t of importedState.tasks) {
            await db.saveTask(t);
        }
        
        // Restore settings
        await db.saveSetting('pillars', importedState.pillars);
        await db.saveSetting('intention', importedState.intention);

        // Update React State
        setTasks(importedState.tasks);
        setPillars(importedState.pillars);
        setIntention(importedState.intention);

    } catch (e) {
        console.error("Import failed", e);
        alert("Hubo un error al restaurar los datos.");
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-sand-50 text-sand-400 animate-pulse">Cargando tu espacio...</div>;
  }

  return (
    <div className="min-h-screen bg-sand-50 text-stone-800 font-sans selection:bg-sage-200 selection:text-sage-900 pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-20 bg-sand-50/80 backdrop-blur-md border-b border-sand-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-sage-700" />
            <h1 className="font-serif font-bold text-xl text-sage-800">Foco Vital</h1>
          </div>
          
          <div className="flex gap-2">
            <button 
                onClick={() => setShowHelp(true)}
                className="p-2 text-stone-500 hover:text-sage-600 hover:bg-white rounded-full transition-colors"
                aria-label="Ayuda"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setShowSettings(true)}
                className="p-2 text-stone-500 hover:text-sage-600 hover:bg-white rounded-full transition-colors"
                aria-label="Configuración"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-12">
        
        {/* Onboarding / Intention */}
        <section className="text-center space-y-4">
          <label htmlFor="intention" className="block text-2xl font-serif text-stone-600">
            ¿Cuál es tu intención para este momento?
          </label>
          <input
            id="intention"
            type="text"
            value={intention}
            onChange={handleIntentionChange}
            placeholder="Ej: Terminar el informe con calma..."
            className="w-full max-w-xl mx-auto text-center bg-transparent border-b-2 border-sage-200 text-xl py-2 focus:outline-none focus:border-sage-500 transition-colors placeholder-stone-300 text-sage-800 font-medium"
            autoComplete="off"
          />
        </section>

        {/* Pillars */}
        <Pillars pillars={pillars} onToggle={togglePillar} />

        {/* Timer */}
        <FocusTimer />

        {/* The Jar */}
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sand-50/50 to-sand-50 pointer-events-none -z-10" />
            <JarOfLife 
                tasks={tasks}
                onAdd={addTask}
                onToggle={toggleTask}
                onDelete={deleteTask}
            />
        </div>
      </main>

      {/* Modals */}
      <HelpGuide isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        currentState={{ intention, pillars, tasks }}
        onImport={importState}
      />
      
      <footer className="mt-20 py-8 text-center text-stone-400 text-xs">
        <p>Inspirado en "El Arte de Concentrarte". Diseñado para la calma.</p>
      </footer>
    </div>
  );
};

export default App;