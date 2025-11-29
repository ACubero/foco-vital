export type TaskCategory = 'piedra' | 'guijarro' | 'arena';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  createdAt: number;
}

export interface PillarState {
  sueno: boolean;
  energia: boolean;
  movimiento: boolean;
  naturaleza: boolean;
  vision: boolean;
  lastUpdated: number;
}

export interface AppState {
  intention: string;
  pillars: PillarState;
  tasks: Task[];
}

export interface BackupData {
  version: number;
  date: string;
  state: AppState;
}

export const PILLAR_LABELS: Record<keyof Omit<PillarState, 'lastUpdated'>, string> = {
  sueno: "Sueño",
  energia: "Energía",
  movimiento: "Movimiento",
  naturaleza: "Naturaleza",
  vision: "Visión"
};