import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      // Redirect to appropriate dashboard based on user role
      if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (user.role === 'rider') {
        navigate('/dashboard/rider');
      } else if (user.role === 'restaurant') {
        navigate('/dashboard/restaurant');
      } else {
        navigate('/dashboard/customer');
      }
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.unverified) {
        navigate('/verify-otp', { state: { email } });
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo-center">
          <img src={logo} alt="BiteDash" />
        </div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">
          Great to see you again. Log in to your account.
        </p>

        {error && <div className="auth-error-chip">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group-custom">
            <Mail className="form-icon" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group-custom">
            <Lock className="form-icon" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-actions">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-pass">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn-primary-auth"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Login <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
