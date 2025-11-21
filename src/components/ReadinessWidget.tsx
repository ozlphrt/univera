import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import './ReadinessWidget.css';

interface ReadinessWidgetProps {
  score: number; // 0-100
  statusLabel?: string;
  breakdown?: {
    profileCompletion: number;
    collegeListBalance: number;
    taskProgress: number;
    hasMatches: boolean;
  };
  // Additional data for detailed breakdown
  collegeCounts?: {
    reach: number;
    target: number;
    safety: number;
  };
  taskCounts?: {
    total: number;
    completed: number;
  };
}

export const ReadinessWidget = ({ 
  score, 
  breakdown,
  collegeCounts,
  taskCounts 
}: ReadinessWidgetProps) => {
  const navigate = useNavigate();

  const getStatusColor = () => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-primary)';
    if (score >= 40) return 'var(--color-warning)';
    return 'var(--color-text-tertiary)';
  };

  // Calculate circumference for circular progress - dial for main score
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;



  const getProfileStatus = () => {
    if (!breakdown) return 'Not started';
    if (breakdown.profileCompletion >= 80) return 'Complete';
    if (breakdown.profileCompletion >= 50) return 'In progress';
    return 'Getting started';
  };

  const getCollegeListStatus = () => {
    if (!breakdown || !collegeCounts) return 'No colleges yet';
    const total = collegeCounts.reach + collegeCounts.target + collegeCounts.safety;
    if (total === 0) return 'No colleges yet';
    if (breakdown.collegeListBalance >= 70) return 'Well balanced';
    if (breakdown.collegeListBalance >= 50) return 'Needs balance';
    return 'Needs work';
  };

  const getTasksStatus = () => {
    if (!breakdown || !taskCounts) return 'No tasks yet';
    if (taskCounts.total === 0) return 'No tasks yet';
    if (breakdown.taskProgress >= 80) return 'On track';
    if (breakdown.taskProgress >= 50) return 'In progress';
    return 'Getting started';
  };

  return (
    <Card 
      className="readiness-widget"
    >
      <div className="readiness-widget__content">
        <div className="readiness-widget__circle-container">
          <div className="readiness-widget__circle-wrapper">
            <svg className="readiness-widget__circle" width="130" height="130">
              <circle
                className="readiness-widget__circle-bg"
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                strokeWidth="9"
              />
              <circle
                className="readiness-widget__circle-progress"
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ stroke: getStatusColor() }}
                transform="rotate(-90 65 65)"
              />
            </svg>
            <div className="readiness-widget__score">
              <span className="readiness-widget__score-value">{score}</span>
              <span className="readiness-widget__score-label">%</span>
            </div>
          </div>
          <div className="readiness-widget__dial-label">Overall Readiness</div>
        </div>
        <div className="readiness-widget__sections">
          {/* Profile Section */}
          {breakdown && (
            <div 
              className="readiness-widget__section readiness-widget__section--compact readiness-widget__section--profile readiness-widget__section--clickable"
              onClick={() => navigate('/profile')}
            >
              <div className="readiness-widget__section-header">
                <h4 className="readiness-widget__section-title">Profile</h4>
              </div>
              <span 
                className="readiness-widget__section-status-text"
                style={{ 
                  color: breakdown.profileCompletion >= 80 
                    ? 'var(--color-success)' 
                    : 'var(--color-text-secondary)' 
                }}
              >
                {getProfileStatus()}
              </span>
            </div>
          )}

          {/* Tasks Section */}
          {breakdown && (
            <div 
              className="readiness-widget__section readiness-widget__section--compact readiness-widget__section--tasks readiness-widget__section--clickable"
              onClick={() => navigate('/tasks')}
            >
              <div className="readiness-widget__section-header">
                <h4 className="readiness-widget__section-title">Tasks</h4>
              </div>
              <span 
                className="readiness-widget__section-status-text"
                style={{ 
                  color: breakdown.taskProgress >= 80 
                    ? 'var(--color-success)' 
                    : 'var(--color-text-secondary)' 
                }}
              >
                {getTasksStatus()}
              </span>
            </div>
          )}

          {/* College List Section */}
          {breakdown && (
            <div 
              className="readiness-widget__section readiness-widget__section--compact readiness-widget__section--college-list readiness-widget__section--clickable"
              onClick={() => navigate('/colleges')}
            >
              <div className="readiness-widget__section-header">
                <h4 className="readiness-widget__section-title">College List</h4>
              </div>
              <span 
                className="readiness-widget__section-status-text"
                style={{ 
                  color: breakdown.collegeListBalance >= 70 
                    ? 'var(--color-accent)' 
                    : 'var(--color-text-secondary)' 
                }}
              >
                {getCollegeListStatus()}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

