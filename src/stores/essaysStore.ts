import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Essay {
  id: string;
  type: 'CommonApp' | 'Supplement' | 'ShortAnswer';
  title: string;
  prompt?: string;
  ideas: string[];
  favoriteIdeas: number[]; // Indices of favorite ideas
  status: 'not_started' | 'brainstorming' | 'outlining' | 'drafting' | 'polishing';
  updatedAt: string;
}

interface EssaysState {
  essays: Essay[];
  setEssays: (essays: Essay[]) => void;
  addEssay: (essay: Omit<Essay, 'id' | 'updatedAt'>) => void;
  updateEssay: (id: string, updates: Partial<Essay>) => void;
  addIdea: (essayId: string, idea: string) => void;
  removeIdea: (essayId: string, ideaIndex: number) => void;
  toggleFavoriteIdea: (essayId: string, ideaIndex: number) => void;
  updateEssayStatus: (id: string, status: Essay['status']) => void;
  getEssayById: (id: string) => Essay | undefined;
}

// Sample essays for demonstration
const SAMPLE_ESSAYS: Essay[] = [
  {
    id: '1',
    type: 'CommonApp',
    title: 'Common App Personal Statement',
    prompt: 'Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.',
    ideas: [],
    favoriteIdeas: [],
    status: 'not_started',
    updatedAt: new Date().toISOString(),
  },
];

export const useEssaysStore = create<EssaysState>()(
  persist(
    (set, get) => ({
      essays: SAMPLE_ESSAYS,

      setEssays: (essays) => set({ essays }),

      addEssay: (essay) => {
        const newEssay: Essay = {
          ...essay,
          id: Date.now().toString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ essays: [...state.essays, newEssay] }));
      },

      updateEssay: (id, updates) =>
        set((state) => ({
          essays: state.essays.map((essay) =>
            essay.id === id
              ? { ...essay, ...updates, updatedAt: new Date().toISOString() }
              : essay
          ),
        })),

      addIdea: (essayId, idea) =>
        set((state) => ({
          essays: state.essays.map((essay) =>
            essay.id === essayId
              ? {
                  ...essay,
                  ideas: [...essay.ideas, idea],
                  status: essay.status === 'not_started' ? 'brainstorming' : essay.status,
                  updatedAt: new Date().toISOString(),
                }
              : essay
          ),
        })),

      removeIdea: (essayId, ideaIndex) =>
        set((state) => ({
          essays: state.essays.map((essay) =>
            essay.id === essayId
              ? {
                  ...essay,
                  ideas: essay.ideas.filter((_, index) => index !== ideaIndex),
                  favoriteIdeas: essay.favoriteIdeas
                    .filter((favIndex) => favIndex !== ideaIndex)
                    .map((favIndex) => (favIndex > ideaIndex ? favIndex - 1 : favIndex)),
                  updatedAt: new Date().toISOString(),
                }
              : essay
          ),
        })),

      toggleFavoriteIdea: (essayId, ideaIndex) =>
        set((state) => ({
          essays: state.essays.map((essay) =>
            essay.id === essayId
              ? {
                  ...essay,
                  favoriteIdeas: essay.favoriteIdeas.includes(ideaIndex)
                    ? essay.favoriteIdeas.filter((fav) => fav !== ideaIndex)
                    : [...essay.favoriteIdeas, ideaIndex],
                  updatedAt: new Date().toISOString(),
                }
              : essay
          ),
        })),

      updateEssayStatus: (id, status) =>
        set((state) => ({
          essays: state.essays.map((essay) =>
            essay.id === id
              ? { ...essay, status, updatedAt: new Date().toISOString() }
              : essay
          ),
        })),

      getEssayById: (id) => {
        return get().essays.find((essay) => essay.id === id);
      },
    }),
    {
      name: 'essays-storage',
    }
  )
);

