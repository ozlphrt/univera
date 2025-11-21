import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/stores/profileStore';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProfileSectionCard } from './ProfileSectionCard';
import './ProfileScreen.css';

export const ProfileScreen = () => {
  const navigate = useNavigate();
  const { academics, extracurriculars, preferences, budget, personality, completionPercentage } =
    useProfileStore();

  const sections = [
    {
      id: 'academics',
      title: 'Academics',
      description: getAcademicsSummary(academics),
      completion: calculateAcademicsCompletion(academics),
      route: '/profile/academics',
    },
    {
      id: 'extracurriculars',
      title: 'Extracurriculars',
      description: getExtracurricularsSummary(extracurriculars),
      completion: calculateExtracurricularsCompletion(extracurriculars),
      route: '/profile/extracurriculars',
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: getPreferencesSummary(preferences),
      completion: calculatePreferencesCompletion(preferences),
      route: '/profile/preferences',
    },
    {
      id: 'budget',
      title: 'Budget & Financial',
      description: getBudgetSummary(budget),
      completion: calculateBudgetCompletion(budget),
      route: '/profile/budget',
    },
    {
      id: 'personality',
      title: 'Personality & Learning Style',
      description: getPersonalitySummary(personality),
      completion: calculatePersonalityCompletion(personality),
      route: '/profile/personality',
    },
  ];

  return (
    <ScreenContainer className="profile-screen" data-page="profile">
      <div className="profile-screen__content">
        <div className="profile-screen__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="profile-screen__back-button"
          >
            ← Dashboard
          </Button>
        </div>
        <h1 className="profile-screen__title">Your Profile</h1>
        <p className="profile-screen__subtitle">
          Complete your profile to get better college matches
        </p>

        {/* Overall Progress */}
        <Card className="profile-screen__progress-card">
          <div className="profile-screen__progress-header">
            <h2 className="profile-screen__progress-title">Profile Completion</h2>
            <span className="profile-screen__progress-percentage">{completionPercentage}%</span>
          </div>
          <div className="profile-screen__progress-bar">
            <div
              className="profile-screen__progress-fill"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </Card>

        {/* Section Cards */}
        <div className="profile-screen__sections">
          {sections.map((section) => (
            <ProfileSectionCard
              key={section.id}
              title={section.title}
              description={section.description}
              completion={section.completion}
              onClick={() => navigate(section.route)}
            />
          ))}
        </div>
      </div>
    </ScreenContainer>
  );
};

// Helper functions for summaries
function getAcademicsSummary(academics: any): string {
  const parts: string[] = [];
  if (academics.gpa) parts.push(`GPA: ${academics.gpa.toFixed(2)}`);
  if (academics.testScores?.sat) parts.push(`SAT: ${academics.testScores.sat}`);
  if (academics.testScores?.act) parts.push(`ACT: ${academics.testScores.act}`);
  if (parts.length === 0) return 'Add your academic information';
  return parts.join(' • ');
}

function getExtracurricularsSummary(extracurriculars: any[]): string {
  if (extracurriculars.length === 0) return 'Add your activities and leadership';
  return `${extracurriculars.length} activity${extracurriculars.length !== 1 ? 'ies' : ''} added`;
}

function getPreferencesSummary(preferences: any): string {
  const parts: string[] = [];
  if (preferences.location?.length) parts.push(`${preferences.location.length} region${preferences.location.length !== 1 ? 's' : ''}`);
  if (preferences.setting) parts.push(preferences.setting);
  if (preferences.size) parts.push(preferences.size);
  if (parts.length === 0) return 'Set your college preferences';
  return parts.join(' • ');
}

function getBudgetSummary(budget: any): string {
  if (budget.maxCost) return `Budget: $${budget.maxCost.toLocaleString()}/year`;
  if (budget.needsAid) return 'Financial aid needed';
  return 'Add budget information';
}

function getPersonalitySummary(personality: any): string {
  if (Object.keys(personality).length === 0) return 'Tell us about your learning style';
  return 'Personality info added';
}

// Helper functions for completion percentages
function calculateAcademicsCompletion(academics: any): number {
  let completed = 0;
  let total = 3;
  if (academics.gpa) completed++;
  if (academics.testScores?.sat || academics.testScores?.act) completed++;
  if (academics.courseRigor) completed++;
  return Math.round((completed / total) * 100);
}

function calculateExtracurricularsCompletion(extracurriculars: any[]): number {
  if (extracurriculars.length === 0) return 0;
  return Math.min(100, extracurriculars.length * 20); // 5+ activities = 100%
}

function calculatePreferencesCompletion(preferences: any): number {
  let completed = 0;
  let total = 3;
  if (preferences.location?.length) completed++; // At least one region selected
  if (preferences.setting?.length) completed++; // Environment selected (urban/suburban/rural)
  if (preferences.size?.length) completed++; // School size selected (small/medium/large)
  return Math.round((completed / total) * 100);
}

function calculateBudgetCompletion(budget: any): number {
  if (budget.maxCost || budget.needsAid !== undefined) return 100;
  return 0;
}

function calculatePersonalityCompletion(personality: any): number {
  if (Object.keys(personality).length === 0) return 0;
  return 100;
}

