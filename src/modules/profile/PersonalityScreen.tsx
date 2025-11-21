import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { useProfileStore } from '@/stores/profileStore';
import './ProfileSectionScreen.css';
import './PersonalityScreen.css';

export const PersonalityScreen = () => {
  const navigate = useNavigate();
  const { personality, updatePersonality, calculateCompletion } = useProfileStore();

  const [learningStyle, setLearningStyle] = useState<string>(
    personality.learningStyle || ''
  );
  const [traits, setTraits] = useState<string[]>(personality.traits || []);
  const [saving, setSaving] = useState(false);

  // Autosave on change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timer);
  }, [learningStyle, traits]);

  const handleSave = async () => {
    setSaving(true);
    updatePersonality({ learningStyle, traits });
    calculateCompletion();
    setSaving(false);
  };

  const handleBack = () => {
    navigate('/profile');
  };

  const toggleTrait = (trait: string) => {
    if (traits.includes(trait)) {
      setTraits(traits.filter((t) => t !== trait));
    } else {
      setTraits([...traits, trait]);
    }
  };

  const learningStyles = [
    'Visual',
    'Hands-on',
    'Reading & Writing',
    'Collaborative',
    'Independent',
  ];

  const traitOptions = [
    'Motivated',
    'Curious',
    'Creative',
    'Analytical',
    'Empathetic',
    'Organized',
    'Flexible',
    'Detail-oriented',
    'Big-picture thinker',
    'Problem solver',
  ];

  return (
    <ScreenContainer className="profile-section-screen" data-page="profile-personality">
      <div className="profile-section-screen__content">
        <div className="profile-section-screen__header">
          <Button variant="ghost" onClick={handleBack} className="profile-section-screen__back">
            ← Back
          </Button>
          <h1 className="profile-section-screen__title">Personality & Learning Style</h1>
        </div>

        <Card className="profile-section-screen__form-card">
          <p className="personality-screen__intro">
            Tell us about how you learn and what traits describe you. This helps us find colleges
            that match your style.
          </p>

          <div className="profile-section-screen__field">
            <label className="profile-section-screen__label">How do you learn best?</label>
            <div className="personality-screen__chips">
              {learningStyles.map((style) => (
                <button
                  key={style}
                  className={`profile-section-screen__chip ${
                    learningStyle === style ? 'profile-section-screen__chip--selected' : ''
                  }`}
                  onClick={() => setLearningStyle(style)}
                  type="button"
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="profile-section-screen__field">
            <label className="profile-section-screen__label">Which traits describe you?</label>
            <p className="profile-section-screen__helper">Select all that apply</p>
            <div className="personality-screen__chips">
              {traitOptions.map((trait) => (
                <Chip
                  key={trait}
                  label={trait}
                  selected={traits.includes(trait)}
                  onToggle={() => toggleTrait(trait)}
                />
              ))}
            </div>
          </div>

          {saving && (
            <p className="profile-section-screen__saving">Saving...</p>
          )}
        </Card>
      </div>
    </ScreenContainer>
  );
};

