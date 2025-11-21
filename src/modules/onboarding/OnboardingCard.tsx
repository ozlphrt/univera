import { ReactNode } from 'react';
import { Button } from '@/components/Button';
import './OnboardingCard.css';

interface OnboardingCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  progress: number; // 0-1 or step/total
  canProceed?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export const OnboardingCard = ({
  title,
  description,
  children,
  onNext,
  onBack,
  progress,
  canProceed = true,
  nextLabel = 'Next',
  backLabel = 'Back',
}: OnboardingCardProps) => {
  const progressPercentage = progress * 100;

  return (
    <div className="onboarding-card" data-page="onboarding-flow">
      {/* Progress bar */}
      <div className="onboarding-card__progress-container">
        <div className="onboarding-card__progress-bar">
          <div
            className="onboarding-card__progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="onboarding-card__progress-text">
          {Math.round(progressPercentage)}%
        </span>
      </div>

      {/* Content */}
      <div className="onboarding-card__content">
        <h1 className="onboarding-card__title">{title}</h1>
        {description && (
          <p className="onboarding-card__description">{description}</p>
        )}
        <div className="onboarding-card__body">{children}</div>
      </div>

      {/* Actions */}
      <div className="onboarding-card__actions">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={!onBack}
          className="onboarding-card__back-button"
        >
          {backLabel}
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!canProceed}
          className="onboarding-card__next-button"
          fullWidth={false}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
};

