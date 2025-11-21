import { Routes, Route, Navigate } from 'react-router-dom';
import { WelcomeScreen, LoginScreen, SignUpScreen } from '@/modules/auth';
import { OnboardingFlow, ProcessingScreen } from '@/modules/onboarding';
import { DashboardScreen } from '@/modules/dashboard';
import {
  ProfileScreen,
  AcademicsScreen,
  ExtracurricularsScreen,
  PreferencesScreen,
  BudgetScreen,
  PersonalityScreen,
} from '@/modules/profile';
import { CollegesListScreen, CollegeDetailScreen } from '@/modules/colleges';
import { TasksScreen, TaskDetailScreen } from '@/modules/tasks';
import { EssaysScreen, BrainstormScreen } from '@/modules/essays';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

function App() {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignUpScreen />} />
      <Route path="/onboarding" element={<OnboardingFlow />} />
      <Route path="/onboarding/processing" element={<ProcessingScreen />} />
      <Route path="/dashboard" element={<DashboardScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/profile/academics" element={<AcademicsScreen />} />
      <Route path="/profile/extracurriculars" element={<ExtracurricularsScreen />} />
      <Route path="/profile/preferences" element={<PreferencesScreen />} />
      <Route path="/profile/budget" element={<BudgetScreen />} />
      <Route path="/profile/personality" element={<PersonalityScreen />} />
      <Route path="/colleges" element={<CollegesListScreen />} />
      <Route path="/colleges/:id" element={<CollegeDetailScreen />} />
      <Route path="/tasks" element={<TasksScreen />} />
      <Route path="/tasks/:id" element={<TaskDetailScreen />} />
      <Route path="/essays" element={<EssaysScreen />} />
      <Route path="/essays/:id" element={<BrainstormScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

