import { create } from 'zustand';

interface UIState {
  isOnboardingComplete: boolean;
  bottomNavVisible: boolean;
  theme: 'light' | 'dark';
  setOnboardingComplete: (complete: boolean) => void;
  setBottomNavVisible: (visible: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Initialize from localStorage
const getInitialOnboardingState = (): boolean => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('onboarding_complete');
  return saved === 'true';
};

export const useUIStore = create<UIState>((set) => ({
  isOnboardingComplete: getInitialOnboardingState(),
  bottomNavVisible: getInitialOnboardingState(),
  theme: 'light',

  setOnboardingComplete: (complete) => {
    set({
      isOnboardingComplete: complete,
      bottomNavVisible: complete, // Show nav after onboarding
    });
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_complete', String(complete));
    }
  },

  setBottomNavVisible: (visible) => set({ bottomNavVisible: visible }),

  setTheme: (theme) => set({ theme }),
}));

