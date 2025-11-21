import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
// import { useAuthStore } from '@/stores/authStore'; // TODO: Use when Supabase is configured
import './AuthScreen.css';

export const SignUpScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // TODO: Integrate with Supabase auth
      // const { data, error } = await supabase.auth.signUp({ email, password });
      // if (error) throw error;
      // setSession(data.session);
      // setUser(data.user);
      
      // Temporary mock for development
      console.log('Signup attempt:', { email, name });
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="auth-screen" data-page="signup">
      <div className="auth-screen__content">
        <h1 className="auth-screen__title">Create Account</h1>
        <p className="auth-screen__subtitle">Start your college guidance journey</p>

        <form onSubmit={handleSubmit} className="auth-screen__form">
          <TextField
            label="Name (Optional)"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            disabled={loading}
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            disabled={loading}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            disabled={loading}
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            disabled={loading}
          />

          {error && <div className="auth-screen__error">{error}</div>}

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="auth-screen__footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-screen__link auth-screen__link--primary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </ScreenContainer>
  );
};

