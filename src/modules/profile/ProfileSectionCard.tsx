import { Card } from '@/components/Card';
import './ProfileSectionCard.css';

interface ProfileSectionCardProps {
  title: string;
  description: string;
  completion: number;
  onClick: () => void;
}

export const ProfileSectionCard = ({
  title,
  description,
  completion,
  onClick,
}: ProfileSectionCardProps) => {
  return (
    <Card className="profile-section-card" interactive onClick={onClick}>
      <div className="profile-section-card__header">
        <h3 className="profile-section-card__title">{title}</h3>
        <span className="profile-section-card__completion">{completion}%</span>
      </div>
      <p className="profile-section-card__description">{description}</p>
      <div className="profile-section-card__progress">
        <div
          className="profile-section-card__progress-fill"
          style={{ width: `${completion}%` }}
        />
      </div>
    </Card>
  );
};

