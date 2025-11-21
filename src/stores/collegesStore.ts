import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface College {
  id: string;
  name: string;
  location: string;
  type: string;
  fitScore?: number;
  category?: 'reach' | 'target' | 'safety';
  fitExplanation?: string;
  logo?: string;
  website?: string;
  // Detailed breakdown data
  breakdown?: {
    academicFit?: number;
    preferenceFit?: number;
    ecFit?: number;
    majorFit?: number;
    competitivenessAdjustment?: number;
  };
  // Full college data for detailed view
  fullData?: {
    size?: number;
    acceptanceRate?: number;
    environment?: string;
    competitiveness?: string;
    popularMajors?: string[];
    cost?: {
      tuitionInState?: number;
      tuitionOutOfState?: number;
      averageNetPrice?: number;
    };
  };
}

interface CollegesState {
  colleges: College[];
  savedColleges: string[];
  filters: {
    category?: 'reach' | 'target' | 'safety' | 'all';
    search?: string;
  };
  selectedCollege: College | null;
  setColleges: (colleges: College[]) => void;
  setSavedColleges: (ids: string[]) => void;
  toggleSave: (id: string) => void;
  setFilters: (filters: Partial<CollegesState['filters']>) => void;
  setSelectedCollege: (college: College | null) => void;
}

export const useCollegesStore = create<CollegesState>()(
  persist(
    (set) => ({
      colleges: [],
      savedColleges: [],
      filters: {
        category: 'all',
      },
      selectedCollege: null,

      setColleges: (colleges) => set({ colleges }),

      setSavedColleges: (ids) => set({ savedColleges: ids }),

      toggleSave: (id) =>
        set((state) => {
          const isSaved = state.savedColleges.includes(id);
          return {
            savedColleges: isSaved
              ? state.savedColleges.filter((savedId) => savedId !== id)
              : [...state.savedColleges, id],
          };
        }),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      setSelectedCollege: (college) => set({ selectedCollege: college }),
    }),
    {
      name: 'colleges-storage',
      partialize: (state) => ({
        colleges: state.colleges,
        savedColleges: state.savedColleges,
      }),
    }
  )
);

