import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp = ({ phoneNumber = '+923211234567' }) => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      'Hi! I want to know more about your delivery services.'
    );
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(
      /\D/g,
      ''
    )}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="floating-whatsapp"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
        zIndex: 999,
        transition: 'all 0.3s ease',
        hover: {
          transform: 'scale(1.1)',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.6)',
        },
      }}
      title="Chat with us on WhatsApp"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
      }}
    >
      <MessageCircle size={32} color="white" />
    </button>
  );
};

export default FloatingWhatsApp;
