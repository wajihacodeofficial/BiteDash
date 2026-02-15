import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * ActionKPICard Component
 * Displays a single KPI metric with action capability
 * Used for critical metrics requiring immediate attention
 */
export const ActionKPICard = ({
  icon: Icon,
  metric,
  value,
  trend,
  severity = 'medium',
  action,
  onClick,
  isLoading = false,
}) => {
  const severityColors = {
    critical: { bg: '#ffe5e5', border: '#e74c3c', text: '#c0392b' },
    high: { bg: '#fff3cd', border: '#f39c12', text: '#d68910' },
    medium: { bg: '#e3f2fd', border: '#3498db', text: '#1976d2' },
    low: { bg: '#e8f5e9', border: '#27ae60', text: '#229954' },
  };

  const colors = severityColors[severity];

  return (
    <div
      style={{
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '20px',
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr auto',
        minHeight: '200px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 24px ${colors.border}40`;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Icon & Metric Name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
        }}
      >
        <Icon size={24} style={{ color: colors.text }} />
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#666',
          }}
        >
          {metric}
        </p>
      </div>

      {/* Value */}
      <div style={{ marginBottom: '12px' }}>
        <p
          style={{
            margin: 0,
            fontSize: '2rem',
            fontWeight: 700,
            color: colors.text,
          }}
        >
          {isLoading ? '...' : value}
        </p>
      </div>

      {/* Trend */}
      <div style={{ marginBottom: '16px' }}>
        <p
          style={{
            margin: 0,
            fontSize: '0.85rem',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {trend?.includes('+') ? (
            <TrendingUp size={14} style={{ color: '#27ae60' }} />
          ) : trend?.includes('-') ? (
            <TrendingDown size={14} style={{ color: '#e74c3c' }} />
          ) : null}
          {trend}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onClick}
        disabled={isLoading}
        style={{
          padding: '10px 16px',
          background: colors.text,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 700,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.transform = 'scale(1.02)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isLoading ? 'Loading...' : action}
      </button>
    </div>
  );
};

export default ActionKPICard;
