import { Card } from './Card';
import { Button } from './Button';
import './NextStepCard.css';

interface NextStepCardProps {
  title: string;
  description: string;
  ctaLabel: string;
  onClick: () => void;
  priority?: 'high' | 'medium' | 'low';
}

export const NextStepCard = ({
  title,
  description,
  ctaLabel,
  onClick,
  priority = 'medium',
}: NextStepCardProps) => {
  const priorityColors = {
    high: 'var(--color-accent)',
    medium: 'var(--color-primary)',
    low: 'var(--color-text-secondary)',
  };

  return (
    <Card className="next-step-card" style={{ borderLeft: `4px solid ${priorityColors[priority]}` }}>
      <div className="next-step-card__content">
        <div className="next-step-card__header">
          <span className="next-step-card__badge" style={{ backgroundColor: priorityColors[priority] }}>
            Next Step
          </span>
        </div>
        <h3 className="next-step-card__title">{title}</h3>
        <p className="next-step-card__description">{description}</p>
        <Button variant="primary" onClick={onClick} className="next-step-card__button">
          {ctaLabel}
        </Button>
      </div>
    </Card>
  );
};

