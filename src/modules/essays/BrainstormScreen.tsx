import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useEssaysStore } from '@/stores/essaysStore';
import './BrainstormScreen.css';

// Common App prompts for brainstorming
const COMMON_APP_PROMPTS = [
  'Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.',
  'The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?',
  'Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?',
  'Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?',
  'Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.',
  'Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?',
  'Share an essay on any topic of your choice. It can be one you\'ve already written, one that responds to a different prompt, or one of your own design.',
];

export const BrainstormScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getEssayById, addIdea, removeIdea, toggleFavoriteIdea, updateEssayStatus } = useEssaysStore();

  const essay = id ? getEssayById(id) : undefined;
  const [newIdea, setNewIdea] = useState('');

  useEffect(() => {
    if (!essay && id) {
      navigate('/essays');
    }
  }, [essay, id, navigate]);

  if (!essay) {
    return (
      <ScreenContainer data-page="essay-brainstorm-error">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Essay not found</p>
          <Button variant="primary" onClick={() => navigate('/essays')}>
            Back to Essays
          </Button>
        </div>
      </ScreenContainer>
    );
  }

  const handleAddIdea = () => {
    if (newIdea.trim()) {
      addIdea(essay.id, newIdea.trim());
      setNewIdea('');
      if (essay.status === 'not_started') {
        updateEssayStatus(essay.id, 'brainstorming');
      }
    }
  };

  const handleRemoveIdea = (index: number) => {
    removeIdea(essay.id, index);
  };

  const handleToggleFavorite = (index: number) => {
    toggleFavoriteIdea(essay.id, index);
  };

  return (
    <ScreenContainer className="brainstorm-screen" data-page="essay-brainstorm">
      <div className="brainstorm-screen__content">
        <div className="brainstorm-screen__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/essays')}
            className="brainstorm-screen__back-button"
          >
            ← Back
          </Button>
        </div>

        <Card className="brainstorm-screen__essay-card">
          <h1 className="brainstorm-screen__title">{essay.title}</h1>
          {essay.prompt && (
            <div className="brainstorm-screen__prompt-section">
              <h2 className="brainstorm-screen__section-title">Prompt</h2>
              <p className="brainstorm-screen__prompt">{essay.prompt}</p>
            </div>
          )}
        </Card>

        {/* Prompt Ideas */}
        {essay.type === 'CommonApp' && (
          <Card className="brainstorm-screen__prompts-card">
            <h2 className="brainstorm-screen__section-title">Prompt Ideas</h2>
            <p className="brainstorm-screen__helper">
              Consider these Common App prompts as starting points for your personal statement
            </p>
            <div className="brainstorm-screen__prompts-list">
              {COMMON_APP_PROMPTS.slice(0, 3).map((prompt, index) => (
                <div key={index} className="brainstorm-screen__prompt-item">
                  <p className="brainstorm-screen__prompt-text">{prompt}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Ideas Section */}
        <Card className="brainstorm-screen__ideas-card">
          <h2 className="brainstorm-screen__section-title">Your Ideas</h2>
          <p className="brainstorm-screen__helper">
            Add bullet-point ideas, stories, or themes you want to explore
          </p>

          {/* Add Idea Input */}
          <div className="brainstorm-screen__add-idea">
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddIdea();
                  }
                }}
                placeholder="Add an idea, story, or theme..."
                className="text-field__input"
                style={{ width: '100%' }}
              />
            </div>
            <Button variant="primary" onClick={handleAddIdea} disabled={!newIdea.trim()}>
              Add
            </Button>
          </div>

          {/* Ideas List */}
          {essay.ideas.length > 0 ? (
            <div className="brainstorm-screen__ideas-list">
              {essay.ideas.map((idea, index) => (
                <div key={index} className="brainstorm-screen__idea-item">
                  <div className="brainstorm-screen__idea-content">
                    <button
                      className={`brainstorm-screen__favorite-button ${
                        essay.favoriteIdeas.includes(index) ? 'brainstorm-screen__favorite-button--active' : ''
                      }`}
                      onClick={() => handleToggleFavorite(index)}
                      type="button"
                      aria-label={essay.favoriteIdeas.includes(index) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {essay.favoriteIdeas.includes(index) ? '★' : '☆'}
                    </button>
                    <p className="brainstorm-screen__idea-text">{idea}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveIdea(index)}
                    className="brainstorm-screen__remove-button"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="brainstorm-screen__empty-ideas">
              No ideas yet. Start adding ideas above to begin brainstorming.
            </p>
          )}
        </Card>
      </div>
    </ScreenContainer>
  );
};

