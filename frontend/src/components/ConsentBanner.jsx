import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie as CookieIcon } from 'lucide-react';

const ConsentBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) {
      setTimeout(() => setShow(true), 1000); // Show after 1s
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShow(false);
  };

  const handleDecline = () => {
    // Still mark as seen/accepted to not annoy, but technically 'declined'
    // For a real app, you'd disable tracking scripts here.
    localStorage.setItem('cookiesAccepted', 'false');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '16px',
        zIndex: 9999,
        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderTop: '2px solid #d92662',
        animation: 'slideUp 0.5s ease-out',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div
            style={{
              background: '#d92662',
              padding: '10px',
              borderRadius: '50%',
            }}
          >
            <CookieIcon size={24} color="white" />
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>
              We use cookies!
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: '0.95rem',
                color: '#e5e7eb',
                lineHeight: '1.5',
              }}
            >
              Hi there! We use cookies to improve your experience and show you
              relevant food options. By continuing to use our site, you agree to
              our
              <Link
                to="/cookies"
                style={{
                  color: '#d92662',
                  textDecoration: 'underline',
                  marginLeft: '4px',
                }}
              >
                Privacy Settings
              </Link>{' '}
              and
              <Link
                to="/privacy"
                style={{
                  color: '#d92662',
                  textDecoration: 'underline',
                  marginLeft: '4px',
                }}
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            minWidth: 'fit-content',
          }}
        >
          <button
            onClick={handleDecline}
            style={{
              background: 'transparent',
              border: '1px solid #6b7280',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            style={{
              background: '#d92662',
              border: 'none',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            Accept All
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @media (max-width: 768px) {
           .container { flexDirection: column !important; }
           .button-group { width: 100%; justifyContent: flex-end; }
        }
      `}</style>
    </div>
  );
};

export default ConsentBanner;
