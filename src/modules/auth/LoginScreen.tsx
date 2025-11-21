import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
// import { useAuthStore } from '@/stores/authStore'; // TODO: Use when Supabase is configured
import './AuthScreen.css';

export const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Integrate with Supabase auth
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) throw error;
      // setSession(data.session);
      // setUser(data.user);
      
      // Temporary mock for development
      console.log('Login attempt:', { email });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="auth-screen" data-page="login">
      <div className="auth-screen__content">
        <h1 className="auth-screen__title">Welcome Back</h1>
        <p className="auth-screen__subtitle">Log in to continue your college journey</p>

        <form onSubmit={handleSubmit} className="auth-screen__form">
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
            placeholder="Enter your password"
            required
            disabled={loading}
          />

          {error && <div className="auth-screen__error">{error}</div>}

          <div className="auth-screen__links">
            <Link to="/forgot-password" className="auth-screen__link">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="auth-screen__footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="auth-screen__link auth-screen__link--primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </ScreenContainer>
  );
};

