import React, { useState } from 'react';
import { Crown, Check, Star, Shield, Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import './Home.css'; // Reusing Home styles for consistency or create new if needed

const PremiumService = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    if (!user) {
      addNotification(
        'Login Required',
        'Please login to subscribe to Premium.'
      );
      navigate('/login');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      addNotification('Upgrade Successful!', '🎉 You are now a Gold Member.');
      navigate('/dashboard/customer');
    }, 1500);
  };
  return (
    <div
      className="page-container"
      style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}
    >
      <div
        className="premium-header"
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <Crown size={64} color="#ffd700" style={{ marginBottom: '20px' }} />
        <h1 style={{ fontSize: '3rem', color: '#333', marginBottom: '20px' }}>
          BiteDash Premium
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          Upgrade your dining experience with exclusive benefits, free delivery,
          and priority support.
        </p>
      </div>

      <div
        className="pricing-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '60px',
        }}
      >
        {/* Free Plan */}
        <div
          className="pricing-card"
          style={{
            padding: '40px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid #eee',
          }}
        >
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Standard</h3>
          <div
            className="price"
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '30px',
            }}
          >
            Free
          </div>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <li
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#666',
              }}
            >
              <Check size={20} color="#27ae60" /> Standard Delivery
            </li>
            <li
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#666',
              }}
            >
              <Check size={20} color="#27ae60" /> Access to all restaurants
            </li>
            <li
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#666',
              }}
            >
              <Check size={20} color="#27ae60" /> 24/7 Support
            </li>
          </ul>
        </div>

        {/* Premium Plan */}
        <div
          className="pricing-card featured"
          style={{
            padding: '40px',
            background: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            color: 'white',
            position: 'relative',
            transform: 'scale(1.05)',
          }}
        >
          <div
            className="badge"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#ffd700',
              color: 'black',
              padding: '5px 15px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '0.8rem',
            }}
          >
            RECOMMENDED
          </div>
          <h3
            style={{
              fontSize: '1.5rem',
              marginBottom: '10px',
              color: '#ffd700',
            }}
          >
            Gold Member
          </h3>
          <div
            className="price"
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '30px',
            }}
          >
            Rs. 499
            <span
              style={{ fontSize: '1rem', fontWeight: 'normal', opacity: 0.7 }}
            >
              /mo
            </span>
          </div>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star size={20} color="#ffd700" /> Free Delivery on all orders
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={20} color="#ffd700" /> Priority Support
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="#ffd700" /> Faster Delivery
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={20} color="#ffd700" /> Exclusive Discounts
            </li>
          </ul>
          <button
            style={{
              width: '100%',
              padding: '15px',
              marginTop: '30px',
              background: '#ffd700',
              border: 'none',
              borderRadius: '10px',
              color: 'black',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Get Premium'}
          </button>
        </div>
      </div>

      <div
        className="features-section"
        style={{ textAlign: 'center', padding: '40px 0' }}
      >
        <h2 style={{ marginBottom: '40px' }}>Why Go Premium?</h2>
        <div
          className="features-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
          }}
        >
          <div className="feature">
            <div
              style={{
                background: '#fff3e0',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Clock size={30} color="#f57c00" />
            </div>
            <h3>Lightning Fast</h3>
            <p style={{ color: '#666' }}>
              Get your food delivered up to 30% faster with priority dispatch.
            </p>
          </div>
          <div className="feature">
            <div
              style={{
                background: '#e8f5e9',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <DollarSignIcon size={30} color="#27ae60" />
            </div>
            <h3>Zero Delivery Fees</h3>
            <p style={{ color: '#666' }}>
              Unlimited free delivery on all orders above Rs. 500.
            </p>
          </div>
          <div className="feature">
            <div
              style={{
                background: '#fce4ec',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Shield size={30} color="#c2185b" />
            </div>
            <h3>VIP Support</h3>
            <p style={{ color: '#666' }}>
              Direct access to our dedicated premium support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Start simple icon component for this file to avoid import issues if missing
const DollarSignIcon = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export default PremiumService;
