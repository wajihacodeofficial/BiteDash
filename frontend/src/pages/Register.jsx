import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  Loader2,
  Phone,
  MapPin,
  Navigation,
} from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import logo from '../assets/logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { location, loading: locationLoading, getLocation } = useGeolocation();

  // Auto-fill address when location is detected
  useEffect(() => {
    if (location && !formData.address) {
      setFormData((prev) => ({ ...prev, address: location.address }));
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await register(formData);
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
      setError(
        err.response?.data?.message ||
          'Registration failed. Check your details.'
      );
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
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join thousands of customers in Karachi</p>

        {error && <div className="auth-error-chip">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group-custom">
            <User className="form-icon" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group-custom">
            <Mail className="form-icon" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group-custom">
            <Phone className="form-icon" size={18} />
            <input
              type="text"
              placeholder="Phone Number (e.g. 03001234567)"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group-custom">
            <MapPin className="form-icon" size={18} />
            <input
              type="text"
              placeholder="Delivery Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>

          {/* Location Detection Button */}
          {!location && (
            <button
              type="button"
              className="btn-outline"
              onClick={getLocation}
              disabled={locationLoading}
              style={{
                width: '100%',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Navigation size={18} />
              {locationLoading ? 'Detecting...' : 'Use My Current Location'}
            </button>
          )}

          {location && (
            <div
              style={{
                padding: '10px 15px',
                background: '#e8f5e9',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '0.9rem',
                color: '#27ae60',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <MapPin size={16} />
              Location detected and filled
            </div>
          )}

          <div className="form-group-custom">
            <Lock className="form-icon" size={18} />
            <input
              type="password"
              placeholder="Strong Alphanumeric Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <p className="form-hint">
            Must be 8+ characters with letters & numbers
          </p>

          <div className="form-group-custom select-group">
            <ShieldCheck className="form-icon" size={18} />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="customer">Order Food</option>
              <option value="rider">Delivery Partner</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary-auth"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>

        <p className="auth-terms">
          By signing up, you agree to our <strong>Terms of Service</strong> and{' '}
          <strong>Privacy Policy</strong>.
        </p>
      </div>
    </div>
  );
};

export default Register;
