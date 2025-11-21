// Onboarding question types and data structures

export type QuestionType = 
  | 'grade'
  | 'academic-assessment'
  | 'intended-major'
  | 'major-selection'
  | 'geographic-preference'
  | 'campus-environment'
  | 'school-size'
  | 'extracurricular-confidence'
  | 'academic-confidence'
  | 'cost-sensitivity'
  | 'application-timeline'
  | 'user-type';

export interface OnboardingAnswer {
  questionId: QuestionType;
  value: any;
}

export interface OnboardingState {
  answers: OnboardingAnswer[];
  currentStep: number;
  totalSteps: number;
  userType?: 'student' | 'parent';
}

export interface QuestionConfig {
  id: QuestionType;
  title: string;
  description?: string;
  type: 'single-choice' | 'multi-choice' | 'slider' | 'text';
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  skipCondition?: (answers: OnboardingAnswer[]) => boolean;
}

