import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import './WelcomeScreen.css';

export const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <ScreenContainer className="welcome-screen" data-page="welcome">
      <div className="welcome-screen__content">
        <div className="welcome-screen__logo">
          <h1 className="welcome-screen__title">Univera</h1>
          <p className="welcome-screen__tagline">College Guidance Made Simple</p>
        </div>

        <div className="welcome-screen__description">
          <p>
            Help high-school students and parents explore colleges, understand fit, build a list,
            and manage the admissions timeline.
          </p>
        </div>

        <div className="welcome-screen__actions">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/onboarding')}
          >
            Get Started
          </Button>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => navigate('/login')}
          >
            I already have an account
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
};

