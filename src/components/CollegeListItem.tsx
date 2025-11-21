import { Card } from './Card';
import './CollegeListItem.css';

interface CollegeListItemProps {
  name: string;
  location: string;
  category?: 'reach' | 'target' | 'safety';
  fitScore?: number;
  logo?: string;
  onClick: () => void;
}

// Helper to get initials from college name
const getInitials = (name: string): string => {
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const CollegeListItem = ({
  name,
  location,
  category,
  fitScore,
  logo,
  onClick,
}: CollegeListItemProps) => {
  const getCategoryColor = () => {
    switch (category) {
      case 'reach':
        return 'var(--color-accent)';
      case 'target':
        return 'var(--color-primary)';
      case 'safety':
        return 'var(--color-success)';
      default:
        return 'var(--color-text-tertiary)';
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'reach':
        return 'Reach';
      case 'target':
        return 'Target';
      case 'safety':
        return 'Safety';
      default:
        return '';
    }
  };

  return (
    <Card className="college-list-item" interactive onClick={onClick}>
      <div className="college-list-item__header">
        {logo ? (
          <img
            src={logo}
            alt={name}
            className="college-list-item__logo"
            onError={(e) => {
              // Fallback to initials if logo fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.college-list-item__logo-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'college-list-item__logo-fallback';
                fallback.textContent = getInitials(name);
                parent.insertBefore(fallback, target);
              }
            }}
          />
        ) : (
          <div className="college-list-item__logo-fallback">{getInitials(name)}</div>
        )}
        <div className="college-list-item__info">
          <h3 className="college-list-item__name">{name}</h3>
          <p className="college-list-item__location">{location}</p>
        </div>
        {category && (
          <div
            className="college-list-item__badge"
            style={{ backgroundColor: getCategoryColor() }}
          >
            {getCategoryLabel()}
          </div>
        )}
      </div>
      {fitScore !== undefined && (
        <div className="college-list-item__fit-score">
          <span className="college-list-item__fit-label">Fit Score:</span>
          <span className="college-list-item__fit-value">{fitScore}%</span>
        </div>
      )}
    </Card>
  );
};

