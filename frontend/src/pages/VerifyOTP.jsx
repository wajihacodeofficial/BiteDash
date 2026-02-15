import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader2, ArrowLeft, RefreshCw, Mail } from 'lucide-react';
import logo from '../assets/logo.png';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus move next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const user = await verifyOTP(email, otpCode);
      if (user.role === 'admin') navigate('/dashboard/admin');
      else if (user.role === 'rider') navigate('/dashboard/rider');
      else if (user.role === 'restaurant') navigate('/dashboard/restaurant');
      else navigate('/dashboard/customer');
    } catch {
      setError('Verification failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendOTP(email);
      setResendCooldown(60);
      setError('');
    } catch (err) {
      setError('Could not resend code. Please try later.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo-center">
          <img src={logo} alt="BiteDash" />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d92662', marginBottom: '20px' }}>
          <ShieldCheck size={28} />
          <h1 className="auth-title" style={{ margin: 0 }}>Verify Email</h1>
        </div>
        
        <p className="auth-subtitle">
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>

        {error && <div className="auth-error-chip">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '30px' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: '45px',
                  height: '55px',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  borderRadius: '12px',
                  border: '2px solid #eee',
                  background: '#f8f9fa',
                  outline: 'none',
                  transition: 'all 0.2s',
                  color: '#333'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #d92662'}
                onBlur={(e) => e.target.style.border = '2px solid #eee'}
                required
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn-primary-auth"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Verify & Continue'
            )}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '20px' }}>
          <button 
            type="button" 
            onClick={handleResend}
            disabled={resendCooldown > 0}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: resendCooldown > 0 ? '#aaa' : '#d92662', 
              fontWeight: '600',
              cursor: resendCooldown > 0 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%'
            }}
          >
             {resendCooldown > 0 ? (
               `Resend code in ${resendCooldown}s`
             ) : (
               <><RefreshCw size={16} /> Resend Verification Code</>
             )}
          </button>
        </div>

        <Link to="/register" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px', color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Register
        </Link>
      </div>
    </div>
  );
};

export default VerifyOTP;
