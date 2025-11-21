import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingCard } from './OnboardingCard';
import { QuestionRenderer } from './QuestionRenderer';
import { onboardingQuestions } from './questions';
import { OnboardingAnswer } from './types';
import { useUIStore } from '@/stores/uiStore';
import { useProfileStore } from '@/stores/profileStore';
import './OnboardingFlow.css';

export const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { setOnboardingComplete } = useUIStore();
  const { updateAcademics, updatePreferences, updateBudget, updateIntendedMajor } = useProfileStore();

  const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Filter questions based on skip conditions
  const visibleQuestions = useMemo(() => {
    return onboardingQuestions.filter((q) => {
      if (q.skipCondition) {
        return !q.skipCondition(answers);
      }
      return true;
    });
  }, [answers]);

  const currentQuestion = visibleQuestions[currentStep];
  const totalSteps = visibleQuestions.length;
  const progress = (currentStep + 1) / totalSteps;

  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id);

  const handleAnswer = (value: any) => {
    const existingIndex = answers.findIndex((a) => a.questionId === currentQuestion.id);
    const newAnswer: OnboardingAnswer = {
      questionId: currentQuestion.id,
      value,
    };

    const updatedAnswers = existingIndex >= 0
      ? [...answers.slice(0, existingIndex), newAnswer, ...answers.slice(existingIndex + 1)]
      : [...answers, newAnswer];
    
    setAnswers(updatedAnswers);

    // Auto-advance for single-choice questions (not multi-choice)
    // User selects one option and we move forward automatically
    if (currentQuestion.type === 'single-choice') {
      // Small delay to show selection feedback before advancing
      setTimeout(() => {
        handleNext();
      }, 300);
    }
    // Multi-choice questions require Next button (user might select multiple)
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Process answers and update profile store
    const academicAnswer = answers.find((a) => a.questionId === 'academic-assessment');
    const costAnswer = answers.find((a) => a.questionId === 'cost-sensitivity');
    const preferencesAnswer = answers.find((a) => a.questionId === 'geographic-preference');

    // Map academic assessment to GPA estimate
    const gpaMap: Record<string, number> = {
      'mostly-a': 3.8,
      'a-and-b': 3.4,
      'mostly-b': 3.0,
      'below-b': 2.5,
    };

    if (academicAnswer) {
      const estimatedGPA = gpaMap[academicAnswer.value as string];
      if (estimatedGPA) {
        updateAcademics({ gpa: estimatedGPA });
      }
    }

    if (preferencesAnswer) {
      const regions = Array.isArray(preferencesAnswer.value)
        ? preferencesAnswer.value
        : [preferencesAnswer.value];
      updatePreferences({ location: regions });
    }

    // Handle campus environment (multi-choice)
    const campusAnswer = answers.find((a) => a.questionId === 'campus-environment');
    if (campusAnswer) {
      const environments = Array.isArray(campusAnswer.value)
        ? campusAnswer.value
        : [campusAnswer.value];
      updatePreferences({ setting: environments });
    }

    // Handle school size (multi-choice)
    const sizeAnswer = answers.find((a) => a.questionId === 'school-size');
    if (sizeAnswer) {
      const sizes = Array.isArray(sizeAnswer.value)
        ? sizeAnswer.value
        : [sizeAnswer.value];
      updatePreferences({ size: sizes });
    }

    if (costAnswer) {
      updateBudget({
        needsAid: costAnswer.value === 'very-important' || costAnswer.value === 'somewhat-important',
      });
    }

    // Handle intended major (multi-choice)
    const majorAnswer = answers.find((a) => a.questionId === 'major-selection');
    if (majorAnswer) {
      const majors = Array.isArray(majorAnswer.value)
        ? majorAnswer.value
        : [majorAnswer.value];
      updateIntendedMajor(majors as string[]);
    }

    // Store answers in localStorage for now (will sync to backend when authenticated)
    localStorage.setItem('onboarding_answers', JSON.stringify(answers));

    // Mark onboarding as complete (this also persists to localStorage)
    setOnboardingComplete(true);
    localStorage.setItem('onboarding_complete', 'true');

    // Navigate to dashboard (or processing screen first)
    navigate('/onboarding/processing');
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const canProceed = currentQuestion.required
    ? currentAnswer?.value !== undefined && 
      currentAnswer?.value !== null &&
      (currentQuestion.type === 'multi-choice'
        ? Array.isArray(currentAnswer.value) && currentAnswer.value.length > 0
        : true)
    : true;

  return (
    <OnboardingCard
      title={currentQuestion.title}
      description={currentQuestion.description}
      onNext={handleNext}
      onBack={currentStep > 0 ? handleBack : undefined}
      progress={progress}
      canProceed={canProceed}
      nextLabel={currentStep === totalSteps - 1 ? 'Complete' : 'Next'}
      backLabel="Back"
    >
      <QuestionRenderer
        question={currentQuestion}
        value={currentAnswer?.value}
        onChange={handleAnswer}
      />
    </OnboardingCard>
  );
};

