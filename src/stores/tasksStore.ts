import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  description?: string;
  phase: string;
  dueDate?: string;
  status: 'not_started' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
}

interface TasksState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  getTasksByPhase: (phase: string) => Task[];
}

// Sample tasks for demonstration
const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Create your activities list',
    description: 'List all your extracurricular activities, volunteer work, and leadership roles. Include hours per week and years of involvement.',
    phase: 'Junior Spring',
    dueDate: '2024-05-15',
    status: 'not_started',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Shortlist 10 colleges',
    description: 'Research and compile a list of 10 colleges that match your interests, academic profile, and preferences.',
    phase: 'Junior Spring',
    dueDate: '2024-06-01',
    status: 'not_started',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Start essay brainstorming',
    description: 'Begin thinking about potential essay topics. Consider meaningful experiences, challenges overcome, or passions that define you.',
    phase: 'Junior Summer',
    dueDate: '2024-07-15',
    status: 'not_started',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Request recommendation letters',
    description: 'Ask 2-3 teachers who know you well to write recommendation letters. Give them at least 4 weeks notice.',
    phase: 'Senior Fall',
    dueDate: '2024-10-01',
    status: 'not_started',
    priority: 'high',
  },
  {
    id: '5',
    title: 'Complete Common App profile',
    description: 'Fill out all sections of the Common Application, including personal information, academics, and activities.',
    phase: 'Senior Fall',
    dueDate: '2024-10-15',
    status: 'not_started',
    priority: 'high',
  },
];

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: SAMPLE_TASKS,

      setTasks: (tasks) => set({ tasks }),

      updateTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, status } : task)),
        })),

      getTasksByPhase: (phase) => {
        return get().tasks.filter((task) => task.phase === phase);
      },
    }),
    {
      name: 'tasks-storage',
    }
  )
);

