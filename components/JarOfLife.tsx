import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Task, TaskCategory } from '../types';

interface JarOfLifeProps {
  tasks: Task[];
  onAdd: (title: string, category: TaskCategory) => void;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_CONFIG = {
  piedra: {
    label: 'Piedras Grandes',
    description: 'Tus 3 prioridades absolutas. Alto impacto.',
    bgColor: 'bg-sage-100',
    borderColor: 'border-sage-300',
    textColor: 'text-sage-900',
    iconColor: 'text-sage-600',
    limit: 3
  },
  guijarro: {
    label: 'Guijarros',
    description: 'Importante, pero secundario.',
    bgColor: 'bg-stone-100',
    borderColor: 'border-stone-300',
    textColor: 'text-stone-800',
    iconColor: 'text-stone-500',
    limit: 10
  },
  arena: {
    label: 'Arena',
    description: 'Tareas pequeñas, gestión y ruido.',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-900',
    iconColor: 'text-orange-400',
    limit: 99
  }
};

export const JarOfLife: React.FC<JarOfLifeProps> = ({ tasks, onAdd, onToggle, onDelete }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('piedra');

  const tasksByCategory = {
    piedra: tasks.filter(t => t.category === 'piedra'),
    guijarro: tasks.filter(t => t.category === 'guijarro'),
    arena: tasks.filter(t => t.category === 'arena'),
  };

  const currentStoneCount = tasksByCategory.piedra.filter(t => !t.completed).length;
  const isStoneLimitReached = currentStoneCount >= CATEGORY_CONFIG.piedra.limit;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    // Prevent adding more stones if limit reached and trying to add active stone
    if (selectedCategory === 'piedra' && isStoneLimitReached) {
        // We allow adding if user really wants, but maybe show warning? 
        // For calm tech, we enforce the limit gently.
        alert("El tarro está lleno. Termina una Piedra Grande antes de añadir otra.");
        return;
    }

    onAdd(newTaskTitle, selectedCategory);
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-sand-200 sticky top-4 z-10 backdrop-blur-md bg-white/90">
        <form onSubmit={handleAdd}>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="¿Qué necesitas añadir al tarro?"
              className="flex-1 bg-sand-50 border-0 rounded-xl px-4 py-3 text-sand-900 placeholder-sand-400 focus:ring-2 focus:ring-sage-400 focus:bg-white transition-all"
            />
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border
                    ${selectedCategory === cat 
                      ? `${CATEGORY_CONFIG[cat].bgColor} ${CATEGORY_CONFIG[cat].borderColor} ${CATEGORY_CONFIG[cat].textColor}` 
                      : 'bg-white border-sand-200 text-sand-500 hover:bg-sand-50'}
                  `}
                >
                  {CATEGORY_CONFIG[cat].label}
                </button>
              ))}
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-sage-600 text-white hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs text-sand-500 pl-2">
            {CATEGORY_CONFIG[selectedCategory].description}
            {selectedCategory === 'piedra' && isStoneLimitReached && (
                <span className="text-amber-600 ml-2 font-medium flex items-center inline-flex gap-1">
                    <AlertCircle className="w-3 h-3" /> Límite diario alcanzado (3/3)
                </span>
            )}
          </div>
        </form>
      </div>

      {/* Lists */}
      <div className="space-y-8">
        {/* Piedras Grandes */}
        <section>
          <h3 className="text-lg font-serif font-bold text-sage-800 mb-4 flex items-center gap-2">
            Piedras Grandes
            <span className="text-xs font-sans font-normal text-sage-600 bg-sage-100 px-2 py-0.5 rounded-full">
               Máx 3
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {tasksByCategory.piedra.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-sage-200 rounded-2xl text-center text-sage-400">
                    Tu tarro está vacío de prioridades. Define tus Piedras Grandes.
                </div>
            ) : (
                tasksByCategory.piedra.map(task => (
                <TaskCard 
                    key={task.id} 
                    task={task} 
                    config={CATEGORY_CONFIG.piedra} 
                    onToggle={onToggle} 
                    onDelete={onDelete} 
                    size="large"
                />
                ))
            )}
          </div>
        </section>

        {/* Guijarros y Arena layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
                <h3 className="text-md font-serif font-semibold text-stone-700 mb-3">Guijarros</h3>
                <div className="space-y-3">
                    {tasksByCategory.guijarro.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            config={CATEGORY_CONFIG.guijarro} 
                            onToggle={onToggle} 
                            onDelete={onDelete} 
                            size="medium"
                        />
                    ))}
                    {tasksByCategory.guijarro.length === 0 && <p className="text-sm text-stone-400 italic pl-2">Nada pendiente aquí.</p>}
                </div>
            </section>

            <section>
                <h3 className="text-md font-serif font-semibold text-orange-800/70 mb-3">Arena</h3>
                <div className="space-y-2">
                    {tasksByCategory.arena.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            config={CATEGORY_CONFIG.arena} 
                            onToggle={onToggle} 
                            onDelete={onDelete} 
                            size="small"
                        />
                    ))}
                     {tasksByCategory.arena.length === 0 && <p className="text-sm text-stone-400 italic pl-2">Tarro limpio de arena.</p>}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

// Subcomponent for individual task
const TaskCard: React.FC<{
    task: Task;
    config: any;
    onToggle: (id: string, v: boolean) => void;
    onDelete: (id: string) => void;
    size: 'large' | 'medium' | 'small';
}> = ({ task, config, onToggle, onDelete, size }) => {
    const isCompleted = task.completed;
    
    const containerClasses = size === 'large' 
        ? `p-5 rounded-2xl border-l-4 ${isCompleted ? 'bg-sage-50/50 border-sage-200 opacity-75' : 'bg-white shadow-sm border-sage-500'}`
        : size === 'medium'
            ? `p-3 rounded-xl border-l-2 ${isCompleted ? 'bg-stone-50 border-stone-200 opacity-60' : 'bg-white shadow-sm border-stone-400'}`
            : `p-2 rounded-lg border-l-2 flex items-center justify-between text-sm ${isCompleted ? 'bg-transparent border-orange-100 opacity-50' : 'bg-white/50 border-orange-200'}`;

    return (
        <div className={`group transition-all duration-300 ${containerClasses}`}>
            <div className="flex items-start gap-3">
                <button 
                    onClick={() => onToggle(task.id, !task.completed)}
                    className={`mt-0.5 transition-colors ${config.iconColor}`}
                >
                    {isCompleted 
                        ? <CheckCircle2 className={`${size === 'large' ? 'w-6 h-6' : 'w-5 h-5'}`} /> 
                        : <Circle className={`${size === 'large' ? 'w-6 h-6' : 'w-5 h-5'}`} />
                    }
                </button>
                
                <div className="flex-1">
                    <span className={`block ${isCompleted ? 'line-through text-stone-400' : 'text-stone-800'} ${size === 'large' ? 'text-lg font-medium' : ''}`}>
                        {task.title}
                    </span>
                </div>

                <button 
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-opacity p-1"
                    title="Eliminar"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};