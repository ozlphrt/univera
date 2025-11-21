import { Card } from './Card';
import './EssayCard.css';

interface EssayCardProps {
  title: string;
  type: 'CommonApp' | 'Supplement' | 'ShortAnswer';
  status: 'not_started' | 'brainstorming' | 'outlining' | 'drafting' | 'polishing';
  ideaCount: number;
  onClick: () => void;
}

export const EssayCard = ({ title, type, status, ideaCount, onClick }: EssayCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'not_started':
        return 'var(--color-text-tertiary)';
      case 'brainstorming':
        return 'var(--color-primary)';
      case 'outlining':
        return 'var(--color-accent)';
      case 'drafting':
        return 'var(--color-warning)';
      case 'polishing':
        return 'var(--color-success)';
      default:
        return 'var(--color-text-tertiary)';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'brainstorming':
        return 'Brainstorming';
      case 'outlining':
        return 'Outlining';
      case 'drafting':
        return 'Drafting';
      case 'polishing':
        return 'Polishing';
      default:
        return 'Unknown';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'CommonApp':
        return 'Common App';
      case 'Supplement':
        return 'Supplement';
      case 'ShortAnswer':
        return 'Short Answer';
      default:
        return type;
    }
  };

  return (
    <Card className="essay-card" interactive onClick={onClick}>
      <div className="essay-card__header">
        <div className="essay-card__info">
          <h3 className="essay-card__title">{title}</h3>
          <span className="essay-card__type">{getTypeLabel()}</span>
        </div>
        <span
          className="essay-card__status"
          style={{ color: getStatusColor() }}
        >
          {getStatusLabel()}
        </span>
      </div>
      {ideaCount > 0 && (
        <div className="essay-card__meta">
          <span className="essay-card__idea-count">{ideaCount} idea{ideaCount !== 1 ? 's' : ''}</span>
        </div>
      )}
    </Card>
  );
};

