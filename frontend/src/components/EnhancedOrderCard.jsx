import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Zap, AlertCircle, ChevronRight } from 'lucide-react';

/**
 * EnhancedOrderCard Component
 * Displays order details with distance, time, earnings, and SLA timer
 * Includes visual urgency indicators
 */
export const EnhancedOrderCard = ({ order, onAccept, onExpire, onDecline }) => {
  const [timeRemaining, setTimeRemaining] = useState(order.timeToExpiry || 60);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const SLA_MS = 60000; // 60 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 60 - Math.floor(elapsed / 1000));
      const progressPercent = (elapsed / SLA_MS) * 100;

      setTimeRemaining(remaining);
      setProgress(Math.min(progressPercent, 100));

      if (remaining === 0) {
        clearInterval(interval);
        if (onExpire) onExpire(order._id);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order._id, onExpire]);

  const getRiskLevel = (order) => {
    if (order.paymentType === 'cash' && order.totalEarnings < 50)
      return 'warning';
    if (order.riskFlags?.length > 0) return 'caution';
    if (order.isSurgeZone) return 'premium';
    return 'normal';
  };

  const getProgressColor = () => {
    if (timeRemaining > 30) return '#27ae60'; // Green
    if (timeRemaining > 10) return '#f39c12'; // Orange
    return '#e74c3c'; // Red
  };

  const getCardBackground = () => {
    if (timeRemaining > 30) return 'white';
    if (timeRemaining > 10) return '#fff3cd';
    return '#ffe5e5';
  };

  const riskLevel = getRiskLevel(order);
  const borderColors = {
    normal: '#27ae60',
    warning: '#f39c12',
    caution: '#e67e22',
    premium: '#9b59b6',
  };

  const getEarningsColor = (amount) => {
    if (amount >= 150) return '#27ae60';
    if (amount >= 100) return '#3498db';
    return '#e74c3c';
  };

  return (
    <div
      style={{
        background: getCardBackground(),
        borderLeft: `4px solid ${borderColors[riskLevel]}`,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      {/* SLA Timer - Top Right */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: getProgressColor(),
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontWeight: 700,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        ⏱️ {timeRemaining}s
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: '4px',
          background: '#e0e0e0',
          borderRadius: '2px',
          marginBottom: '12px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: getProgressColor(),
            transition: 'width 0.3s linear',
          }}
        />
      </div>

      {/* Urgency Warning */}
      {timeRemaining <= 10 && (
        <div
          style={{
            background: '#e74c3c',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            marginBottom: '12px',
            fontWeight: 700,
            textAlign: 'center',
            animation: 'pulse 1s infinite',
          }}
        >
          ⚡ HURRY! Expires in {timeRemaining}s
        </div>
      )}

      {/* Restaurant Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '12px',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
            🍔 {order.restaurantName}
          </h3>
          <p
            style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#666' }}
          >
            ⭐ {order.restaurantRating} ({order.restaurantReviewCount} reviews)
          </p>
        </div>
      </div>

      {/* Distance & Time */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '12px',
          padding: '12px',
          background: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <div>
          <p style={{ fontSize: '0.8rem', color: '#999', margin: 0 }}>
            📍 Pickup Distance
          </p>
          <p
            style={{
              fontWeight: 700,
              margin: '4px 0 0 0',
              fontSize: '0.95rem',
            }}
          >
            {order.pickupDistance} km • {order.pickupEstimatedTime} mins
          </p>
        </div>
        <div>
          <p style={{ fontSize: '0.8rem', color: '#999', margin: 0 }}>
            📍 Dropoff Distance
          </p>
          <p
            style={{
              fontWeight: 700,
              margin: '4px 0 0 0',
              fontSize: '0.95rem',
            }}
          >
            {order.dropoffDistance} km • {order.dropoffEstimatedTime} mins
          </p>
        </div>
      </div>

      {/* Total Time */}
      <div
        style={{
          background: '#e8f5e9',
          padding: '8px 12px',
          borderRadius: '6px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.95rem',
        }}
      >
        <Clock size={16} />
        <strong>Total: {order.totalEstimatedTime} mins</strong>
      </div>

      {/* Earnings & Payment */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            background: '#f0f0f0',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
            💰 Earning
          </p>
          <p
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: getEarningsColor(order.totalEarnings),
              margin: '4px 0 0 0',
            }}
          >
            Rs. {order.totalEarnings}
          </p>
        </div>
        <div
          style={{
            background: '#f0f0f0',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
            💳 Payment
          </p>
          <p
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              margin: '4px 0 0 0',
              color: order.paymentType === 'online' ? '#3498db' : '#e67e22',
            }}
          >
            {order.paymentType === 'online' ? '💳 Online' : '💵 Cash'}
          </p>
        </div>
      </div>

      {/* Surge Indicator */}
      {order.isSurgeZone && (
        <div
          style={{
            background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
          }}
        >
          <Zap size={16} />+{Math.round((order.surgeMultiplier - 1) * 100)}%
          surge bonus!
        </div>
      )}

      {/* Action Buttons */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px' }}
      >
        <button
          onClick={() => onDecline?.(order._id)}
          style={{
            padding: '10px 16px',
            borderRadius: '6px',
            background: '#f0f0f0',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Decline
        </button>
        <button
          onClick={() => onAccept(order._id)}
          style={{
            padding: '10px 16px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          Accept <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default EnhancedOrderCard;
