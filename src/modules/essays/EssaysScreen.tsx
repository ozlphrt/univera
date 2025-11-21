import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EssayCard } from '@/components/EssayCard';
import { useEssaysStore } from '@/stores/essaysStore';
import './EssaysScreen.css';

export const EssaysScreen = () => {
  const navigate = useNavigate();
  const { essays } = useEssaysStore();

  return (
    <ScreenContainer className="essays-screen" data-page="essays-list">
      <div className="essays-screen__content">
        <div className="essays-screen__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="essays-screen__back-button"
          >
            ← Dashboard
          </Button>
          <h1 className="essays-screen__title">Essays</h1>
        </div>

        <p className="essays-screen__description">
          Plan and brainstorm your college application essays. Start with prompts and ideas, then track your progress.
        </p>

        {essays.length === 0 ? (
          <Card className="essays-screen__empty">
            <p className="essays-screen__empty-text">
              No essays yet. Your Common App Personal Statement will appear here once you start.
            </p>
          </Card>
        ) : (
          <div className="essays-screen__list">
            {essays.map((essay) => (
              <EssayCard
                key={essay.id}
                title={essay.title}
                type={essay.type}
                status={essay.status}
                ideaCount={essay.ideas.length}
                onClick={() => navigate(`/essays/${essay.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </ScreenContainer>
  );
};

