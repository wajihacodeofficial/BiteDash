import React, { useState, useEffect } from 'react';
import { RefreshCw, Phone, X } from 'lucide-react';
import api from '../api';

/**
 * LiveOrdersWidget Component
 * Real-time display of active orders with auto-refresh
 * Shows order details with quick action buttons
 */
export const LiveOrdersWidget = ({ filters = {} }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    fetchLiveOrders();
    const interval = setInterval(fetchLiveOrders, 5000);
    return () => clearInterval(interval);
  }, [statusFilter, filters]);

  const fetchLiveOrders = async () => {
    try {
      const res = await api.get('/admin/stats'); // We can use stats or a specific live-orders endpoint
      // For now, let's use the recent orders from stats and filter for active ones
      const activeOrders = res.data.recentOrders
        .filter((o) =>
          ['pending', 'preparing', 'out_for_delivery'].includes(o.status)
        )
        .map((o) => ({
          _id: o._id,
          restaurantName: o.restaurant?.name || 'Restaurant',
          riderName: o.rider?.name || null,
          riderPhone: o.rider?.phone || null,
          status: o.status,
          elapsedTime: Math.floor((new Date() - new Date(o.createdAt)) / 1000),
          totalAmount: o.finalAmount,
          customerName: o.user?.name || 'Customer',
        }));

      setOrders(activeOrders);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching live orders:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#fff3cd', text: '#f39c12', label: 'Pending' },
      confirmed: { bg: '#e3f2fd', text: '#3498db', label: 'Confirmed' },
      preparing: { bg: '#fff3cd', text: '#f39c12', label: 'Preparing' },
      ready: { bg: '#c8e6c9', text: '#27ae60', label: 'Ready' },
      picked_up: { bg: '#b2ebf2', text: '#1abc9c', label: 'Picked Up' },
      in_transit: { bg: '#e1f5fe', text: '#667eea', label: 'In Transit' },
      delivered: { bg: '#c8e6c9', text: '#27ae60', label: 'Delivered' },
    };
    return colors[status] || colors.pending;
  };

  const isDelayed = (elapsedTime) => elapsedTime > 1800; // 30 mins

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    console.log('Cancel order:', orderId);
  };

  const handleAlertRider = async (orderId, riderPhone) => {
    console.log('Alert rider:', orderId, riderPhone);
    alert('Rider alerted!');
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        marginTop: '24px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
          🔴 Live Orders ({orders.length} active)
        </h2>
        <button
          onClick={fetchLiveOrders}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          padding: '12px 20px',
          background: '#f8f9fa',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[
          'all',
          'pending',
          'confirmed',
          'preparing',
          'ready',
          'picked_up',
          'in_transit',
        ].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: '6px 12px',
              background: statusFilter === status ? '#667eea' : 'white',
              color: statusFilter === status ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: 600,
            }}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.95rem',
          }}
        >
          <thead>
            <tr
              style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}
            >
              <th
                style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}
              >
                Order ID
              </th>
              <th
                style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}
              >
                Restaurant
              </th>
              <th
                style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}
              >
                Rider
              </th>
              <th
                style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}
              >
                Status
              </th>
              <th
                style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}
              >
                Time
              </th>
              <th
                style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const statusColor = getStatusColor(order.status);
              const delayed = isDelayed(order.elapsedTime);

              return (
                <tr
                  key={order._id}
                  style={{
                    borderBottom: '1px solid #e0e0e0',
                    background: delayed ? '#ffe5e5' : 'white',
                    transition: 'background 0.3s',
                  }}
                >
                  <td style={{ padding: '12px', fontWeight: 700 }}>
                    #{order._id.slice(-6)}
                  </td>
                  <td style={{ padding: '12px' }}>{order.restaurantName}</td>
                  <td style={{ padding: '12px' }}>
                    {order.riderName ? (
                      <div>
                        <p style={{ margin: 0, fontWeight: 700 }}>
                          {order.riderName}
                        </p>
                        <p
                          style={{
                            margin: '4px 0 0 0',
                            fontSize: '0.85rem',
                            color: '#666',
                          }}
                        >
                          {order.riderPhone}
                        </p>
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        background: statusColor.bg,
                        color: statusColor.text,
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                      }}
                    >
                      {statusColor.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div>
                      {formatTime(order.elapsedTime)}
                      {delayed && (
                        <div
                          style={{
                            color: '#e74c3c',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          ⚠️ DELAYED
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        title="Alert Rider"
                        onClick={() =>
                          handleAlertRider(order._id, order.riderPhone)
                        }
                        style={{
                          width: '32px',
                          height: '32px',
                          background: '#1976d2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'opacity 0.3s',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = '0.8')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = '1')
                        }
                      >
                        <Phone size={14} />
                      </button>
                      <button
                        title="Cancel Order"
                        onClick={() => handleCancelOrder(order._id)}
                        style={{
                          width: '32px',
                          height: '32px',
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'opacity 0.3s',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = '0.8')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = '1')
                        }
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
          No active orders right now
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          padding: '12px 20px',
          background: '#f8f9fa',
          borderTop: '1px solid #e0e0e0',
          fontSize: '0.85rem',
          color: '#666',
        }}
      >
        Last updated: {lastRefresh ? lastRefresh.toLocaleTimeString() : 'Never'}
      </div>
    </div>
  );
};

export default LiveOrdersWidget;
