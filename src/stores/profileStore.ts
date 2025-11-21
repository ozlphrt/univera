import { create } from 'zustand';

// Profile data structure (will be expanded based on DATA_MODELS.md)
interface ProfileState {
  academics: {
    gpa?: number;
    weightedGpa?: number;
    courseRigor?: 'low' | 'medium' | 'high';
    testScores?: {
      sat?: number;
      act?: number;
    };
  };
  extracurriculars: Array<{
    id: string;
    name: string;
    type: string;
    hoursPerWeek?: number;
  }>;
  preferences: {
    location?: string[];
    size?: string[];
    type?: string[];
    setting?: string[];
  };
  intendedMajor?: string[];
  budget: {
    maxCost?: number;
    needsAid?: boolean;
  };
  personality: Record<string, any>;
  completionPercentage: number;
  updateAcademics: (data: Partial<ProfileState['academics']>) => void;
  updateExtracurriculars: (data: ProfileState['extracurriculars']) => void;
  updatePreferences: (data: Partial<ProfileState['preferences']>) => void;
  updateIntendedMajor: (major: string[]) => void;
  updateBudget: (data: Partial<ProfileState['budget']>) => void;
  updatePersonality: (data: Partial<ProfileState['personality']>) => void;
  calculateCompletion: () => void;
  updateTestScores: (scores: Partial<ProfileState['academics']['testScores']>) => void;
}

// Load initial state from localStorage
const loadProfileFromStorage = () => {
  if (typeof window === 'undefined') {
    return {
      academics: {},
      extracurriculars: [],
      preferences: {},
      budget: {},
      personality: {},
      completionPercentage: 0,
    };
  }

  try {
    const saved = localStorage.getItem('profile_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
      academics: parsed.academics || {},
      extracurriculars: parsed.extracurriculars || [],
      preferences: parsed.preferences || {},
      intendedMajor: Array.isArray(parsed.intendedMajor) 
        ? parsed.intendedMajor 
        : parsed.intendedMajor 
          ? [parsed.intendedMajor] 
          : undefined,
      budget: parsed.budget || {},
      personality: parsed.personality || {},
      completionPercentage: parsed.completionPercentage || 0,
      };
    }
  } catch (e) {
    console.error('Error loading profile from storage:', e);
  }

  return {
    academics: {},
    extracurriculars: [],
    preferences: {},
    intendedMajor: undefined,
    budget: {},
    personality: {},
    completionPercentage: 0,
  };
};

const initialProfile = loadProfileFromStorage();

export const useProfileStore = create<ProfileState>((set, get) => ({
  ...initialProfile,

  updateAcademics: (data) =>
    set((state) => {
      const updated = {
        academics: { ...state.academics, ...data },
      };
      saveProfileToStorage({ ...state, ...updated });
      return updated;
    }),

  updateExtracurriculars: (data) =>
    set((state) => {
      const updated = { extracurriculars: data };
      saveProfileToStorage({ ...state, ...updated });
      return updated;
    }),

  updatePreferences: (data) =>
    set((state) => {
      const updated = {
        preferences: { ...state.preferences, ...data },
      };
      saveProfileToStorage({ ...state, ...updated });
      return updated;
    }),

  updateIntendedMajor: (major) =>
    set((state) => {
      const updated = { intendedMajor: Array.isArray(major) ? major : [major] };
      saveProfileToStorage({ ...state, ...updated });
      return updated;
    }),

  updateBudget: (data) =>
    set((state) => {
      const updated = {
        budget: { ...state.budget, ...data },
      };
      saveProfileToStorage({ ...state, ...updated });
      return updated;
    }),

  updatePersonality: (data) =>
    set((state) => {
      const updated = {
        personality: { ...state.personality, ...data },
      };
      saveProfileToStorage({ ...state, ...updated });
      return updated;
    }),

  updateTestScores: (scores) =>
    set((state) => ({
      academics: {
        ...state.academics,
        testScores: { ...state.academics.testScores, ...scores },
      },
    })),

  calculateCompletion: () => {
    const state = get();
    // Simple completion calculation (will be refined)
    let completed = 0;
    let total = 5;

    if (Object.keys(state.academics).length > 0) completed++;
    if (state.extracurriculars.length > 0) completed++;
    if (Object.keys(state.preferences).length > 0) completed++;
    if (Object.keys(state.budget).length > 0) completed++;
    if (Object.keys(state.personality).length > 0) completed++;

    const percentage = Math.round((completed / total) * 100);
    const updated = { completionPercentage: percentage };
    saveProfileToStorage({ ...state, ...updated });
    set(updated);
  },
}));

// Helper function to save profile to localStorage
function saveProfileToStorage(state: ProfileState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      'profile_data',
      JSON.stringify({
        academics: state.academics,
        extracurriculars: state.extracurriculars,
        preferences: state.preferences,
        intendedMajor: state.intendedMajor,
        budget: state.budget,
        personality: state.personality,
        completionPercentage: state.completionPercentage,
      })
    );
  } catch (e) {
    console.error('Error saving profile to storage:', e);
  }
}

